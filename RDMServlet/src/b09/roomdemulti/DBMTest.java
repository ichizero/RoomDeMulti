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
    // private static final String DB_PATH = "jdbc:sqlite:webapps/ROOT/WEB-INF/database.db";
    private static final String DB_PATH = "jdbc:sqlite:WebContent/WEB-INF/database.db";

    private boolean exists(String userName)
            throws ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
        int existCount = 0;

        Class.forName("org.sqlite.JDBC").newInstance();
        Connection conn = DriverManager.getConnection(DB_PATH);
        Statement state = conn.createStatement();

        String sql = "SELECT COUNT(*) FROM users WHERE userName='" + userName + "';";
        ResultSet result = state.executeQuery(sql);
        existCount = result.getInt(1);

        result.close();
        state.close();
        if (conn != null) {
            conn.close();
        }

        if (existCount == 1) {
            return true;
        } else {
            return false;
        }
    }

    public String authenticateUser(String userName, String password)
            throws Exception, ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
        if (!exists(userName)) {
            throw new Exception("User does not exist.");
        }

        JSONObject resultJson = new JSONObject();

        Class.forName("org.sqlite.JDBC").newInstance();
        Connection conn = DriverManager.getConnection(DB_PATH);
        Statement state = conn.createStatement();

        String sql = "SELECT * FROM users WHERE userName='" + userName + "';";
        ResultSet result = state.executeQuery(sql);
        if (password.equals(result.getString("userPass"))) {
            resultJson.put("userName", result.getString("userName"));
            resultJson.put("userURL", result.getString("userURL"));
        } else {
            throw new Exception("Password is incorrect.");
        }

        result.close();
        state.close();
        if (conn != null) {
            conn.close();
        }

        return resultJson.toString();
    }

    public String registerUser(String userName, String password, String userURL)
            throws Exception, ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
        if (exists(userName)) {
            throw new Exception("User name is already in use.");
        }

        JSONObject resultJson = new JSONObject();

        Class.forName("org.sqlite.JDBC").newInstance();
        Connection conn = DriverManager.getConnection(DB_PATH);
        Statement state = conn.createStatement();

        String sql = "INSERT INTO users (userName,userURL,userPass) VALUES ('" + userName + "', '" + userURL + "', '"
                + password + "');";
        state.executeUpdate(sql);
        sql = "SELECT * FROM users WHERE userName='" + userName + "';";
        ResultSet result = state.executeQuery(sql);

        resultJson.put("userName", result.getString("userName"));
        resultJson.put("userURL", result.getString("userURL"));

        result.close();
        state.close();
        if (conn != null) {
            conn.close();
        }

        return resultJson.toString();
    }

}
