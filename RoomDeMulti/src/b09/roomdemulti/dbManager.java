package b09.roomdemulti;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class dbManager {

	private Room room;
	private User user;
	private Request request;
    Connection conn = null;
    String sqlurl = "";
    String sqluser = "root";
    String sqlpass = "";


	/**
	 * アカウント認証を行うためのメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @return ユーザIDとパスワードが一致していれば true を返す
	 */
	public boolean admit(String id, String pass) {
		if(!isExistingID(id)) {
			System.out.println("正しいIDが入力されていません。");
			return false;
		}

		else {
			boolean flag = false;

			 try {
		    		Class.forName("com.mysql.jdbc.Driver").newInstance();
				conn = DriverManager.getConnection(sqlurl, sqluser, sqlpass);

				Statement stmt = conn.createStatement();
			    String sql = "SELECT * FROM users WHERE userName='" + id + "';" ;
			    ResultSet rs = stmt.executeQuery(sql);

			    int userID = rs.getInt("userID");
			    String userName = rs.getString("userName");
			    String userURL = rs.getString("userURL");
			    String userPass = rs.getString("userPass");

			    if(userPass.equals(pass)) {
			    		flag = true;
			    		user = new User(userID,userName,userPass,userURL);
			    }

			    rs.close();
			    stmt.close();
			} catch (SQLException e) {
				// TODO 自動生成された catch ブロック
				e.printStackTrace();
			} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
				// TODO 自動生成された catch ブロック
				e.printStackTrace();
			} finally{
			      try{
			          if (conn != null){
			            conn.close();
			          }
			        }catch (SQLException e){
			          System.out.println("SQLException:" + e.getMessage());
			        }
			}
	 return flag;
		 }
	}

	/**
	 * データベースにアカウントを追加するためのメソッド
	 *
	 * @param id
	 * @param pass
	 * @param multiURL
	 */
	public void addAccount(String id, String pass, String multiURL) {
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(sqlurl, sqluser, sqlpass);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO users (userName,userURL,userPass) VALUES ('" + id +
					"','" + multiURL + "','" + pass + "');";
			int num = stmt.executeUpdate(sql);

			stmt.close();
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} finally{
			try{
				if (conn != null){
					conn.close();
				}
			}catch (SQLException e){
				System.out.println("SQLException:" + e.getMessage());
			}
		}
	}

	/**
	 * ???
	 *
	 */
	public void getRoomList() {

	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomName
	 */
	public void addRoom(String roomName) {

	}

	/**
	 * ???
	 *
	 */
	public void getRoomInf() {

	}

	/**
	 * ルームに参加するためのメソッド
	 * ( Room クラスの userList にユーザを追加する)
	 *
	 */
	public void joinRoom() {

	}

	/**
	 * room.html でのクエスト募集の一覧で、クエスト名で絞り込みを行うためのメソッド
	 *
	 * @param questName クエスト名
	 */
	public void narrowByQuest(String questName) {

	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param questName クエスト名
	 */
	public void addRequest(String questName) {

	}

	/**
	 * データベースに存在するIDか確認するためのメソッド
	 *
	 * @param id ユーザID
	 * @return データベースに存在すれば true を返す
	 */
	public boolean isExistingID(String id) {
		int count = 0;
	    try {
	    		Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(sqlurl, sqluser, sqlpass);

			Statement stmt = conn.createStatement();
		    String sql = "SELECT userID FROM users WHERE userName=" + id + ";" ;
		    ResultSet rs = stmt.executeQuery(sql);

		    while(rs.next()) {
		    		++count;
		    }

		    rs.close();
		    stmt.close();
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} finally{
		      try{
		          if (conn != null){
		            conn.close();
		          }
		        }catch (SQLException e){
		          System.out.println("SQLException:" + e.getMessage());
		        }
		}

	    if(count == 1) return true;
	    else return false;
	}
}
