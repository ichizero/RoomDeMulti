package b09.roomdemulti;

import java.util.ArrayList;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.JSONObject;
import org.json.JSONArray;

/**
 * データベースを扱う
 */
public class DBMTest {
    // データベースのパス
    private static final String DB_PATH = "jdbc:sqlite:WebContent/WEB-INF/database.db";

    private boolean exists(String userName) {
        int existCount = 0;

        Connection conn = null;
        ResultSet result = null;
        try {
            Class.forName("org.sqlite.JDBC").newInstance();
            conn = DriverManager.getConnection(DB_PATH);
            Statement state = conn.createStatement();

            String sql = "SELECT COUNT(*) FROM users WHERE userName='" + userName + "';";
            result = state.executeQuery(sql);

            existCount = result.getInt(1);

            result.close();
            state.close();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            System.out.println("Exception: Failed to load SQLite driver.");
        } catch (SQLException e) {
            System.out.println("SQLException:" + e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                System.out.println("SQLException:" + e.getMessage());
            }
        }

        if (existCount == 1) {
            return true;
        } else {
            return false;
        }
    }

    public String authenticateUser(String userName, String password) {
        if (!exists(userName)) {
            return "Error: This user does not exist.";
        }

        JSONObject resultJson = new JSONObject();

        Connection conn = null;
        ResultSet result = null;
        try {
            Class.forName("org.sqlite.JDBC").newInstance();
            conn = DriverManager.getConnection(DB_PATH);
            Statement state = conn.createStatement();

            String sql = "SELECT * FROM users WHERE userName='" + userName + "';";
            result = state.executeQuery(sql);
            if (password.equals(result.getString("userPass"))) {
                resultJson.put("userName", result.getString("userName"));
                resultJson.put("userURL", result.getString("userURL"));
            } else {
                resultJson.put("Error", "パスワードが間違っています。");
            }

            result.close();
            state.close();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            System.out.println("Exception: Failed to load SQLite driver.");
        } catch (SQLException e) {
            System.out.println("SQLException:" + e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                System.out.println("SQLException:" + e.getMessage());
            }
        }

        return resultJson.toString();
    }

    public String registerUser(String userName, String password, String userURL) {
        if (exists(userName)) {
            return "Error: This user name is already registered.";
        }

        JSONObject resultJson = new JSONObject();

        Connection conn = null;
        ResultSet result = null;
        try {
            Class.forName("org.sqlite.JDBC").newInstance();
            conn = DriverManager.getConnection(DB_PATH);
            Statement state = conn.createStatement();

            String sql = "INSERT INTO users (userName,userURL,userPass) VALUES ('" + userName + "', '" + userURL
                    + "', '" + password + "');";
            state.executeUpdate(sql);
            sql = "SELECT * FROM users WHERE userName='" + userName + "';";
            result = state.executeQuery(sql);

            resultJson.put("userName", result.getString("userName"));
            resultJson.put("userURL", result.getString("userURL"));

            result.close();
            state.close();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            System.out.println("Exception: Failed to load SQLite driver.");
        } catch (SQLException e) {
            System.out.println("SQLException:" + e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                System.out.println("SQLException:" + e.getMessage());
            }
        }

        return resultJson.toString();
    }

}
