package b09.roomdemulti;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;


public class dbManager {

	private ArrayList<Room> rooms;
	private Room room;
	private User user;
	private Request request;
	Connection conn = null;
	String database_path = getServletContext().getRealPath("WEB-INF/database.db");

	/**
	 * アカウント認証を行うためのメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @return ユーザIDとパスワードが一致していれば true を返す
	 */
	public string admit(String id, String pass) {
		if (!isExistingID(id)) {
			return "";
		}

		else {
			string flag = "";

			try {
				Class.forName("org.sqlite.JDBC").newInstance();
				conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

				Statement stmt = conn.createStatement();
				String sql = "SELECT * FROM users WHERE userName='" + id + "';";
				ResultSet rs = stmt.executeQuery(sql);
				JSONArray jsonArray = convertToJSON(rs);

				int userID = rs.getInt("userID");
				String userName = rs.getString("userName");
				String userURL = rs.getString("userURL");
				String userPass = rs.getString("userPass");

				if (userPass.equals(pass)) {
					frag = "\"userId\":\"" + uesrId + "\",” + “\"userURL\":\"" + userURL + "\"";
					user = new User(userID, userName, userPass, userURL);
					rooms = new ArrayList<Room>();

					sql = "SELECT * FROM requests WHERE userID='" + userID + "';";
					rs = stmt.executeQuery(sql);

					ArrayList<Integer> num = new ArrayList<Integer>();
					while (rs.next()) {
						int roomID = rs.getInt("roomID");
						num.add(roomID);
					}

					for (int i = 0; i == num.size() - 1; i++) {
						sql = "SELECT * FROM rooms WHERE roomID=" + num.get(i) + ";";
						rs = stmt.executeQuery(sql);

						String roomName = rs.getString("roomName");
						room = new Room(rs.getInt("roomID"), roomName);

						sql = "SELECT * FROM requests WHERE roomID=" + num.get(i) + ";";
						rs = stmt.executeQuery(sql);

						while (rs.next()) {
							userID = rs.getInt("userID");
							String text = rs.getString("requesstText");
							request = new Request(userID, text);
							room.addRequest(request);

							sql = "SELECT * FROM users WHERE userID=" + userID + ";";
							rs = stmt.executeQuery(sql);
							userName = rs.getString("userName");
							userURL = rs.getString("userURL");
							userPass = rs.getString("userPass");
							User user2 = new User(userID, userName, userPass, userURL);
							room.addUser(user2);
						}
						rooms.add(room);
					}
				}

				rs.close();
				stmt.close();
			} catch (SQLException e) {
				// TODO 自動生成された catch ブロック
				e.printStackTrace();
			} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
				// TODO 自動生成された catch ブロック
				e.printStackTrace();
			} finally {
				try {
					if (conn != null) {
						conn.close();
					}
				} catch (SQLException e) {
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
	public String addAccount(String id, String pass, String multiURL) {
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO users VALUES (null,'" + id + "','" + multiURL + "','"
					+ pass + "');";
			int num = stmt.executeUpdate(sql);

			stmt.close();
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("SQLException:" + e.getMessage());
			}
		}
		return "\"userId\":\"" + id + "\",” + “\"userURL\":\"" + multiURL + "\"";
	}

	/**
	 * ???
	 *
	 */
	public void getRoomList(String userID) {

	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomName
	 */
	public void addRoom(int roomID) {
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO rooms VALUES (null,'" + roomName + "');";
			int num = stmt.executeUpdate(sql);

			stmt.close();
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("SQLException:" + e.getMessage());
			}
		}
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
	 * @param roomName ルーム名
	 */
	public void joinRoom(String roomID) {

	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param requestMessage 募集文
	 * @param roomID ルームID
	 */
	protected void addRequest(String requestMessage, int roomID) {
		try {
			String str = "";
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO requests VALUES (" + roomID + "," + user.getUserID() + ",'" + requestMessage + "');";
			int num = stmt.executeUpdate(sql);

			request = new Request(user.getUserID(),requestMessage);
			for(int i = 0;i == rooms.size()-1;i++){
				if(rooms.get(i).getRoomID() == roomID){
					room.addRequest(request);
				}
			}

			sql = "SELECT * FROM requests WHERE roomID='" + roomID + "';";
			rs = stmt.executeQuery(sql);


			rs.last();
			int nor = rs.getRow();
			rs.beforeFirst();
			if(nor != 1){

			}

			while(rs.next()){
				String a = "\"userId\":\"" + id + "\",” + “\"userURL\":\"" + multiURL + "\"";
				builder.append("\"userId\":\"").append(userId).append("\",");
				builder.append("\"userURL\":\"").append(userId).append("\",");
				builder.append("\"requestMessage\":\"").append(userURL).append("\"");
			}

			stmt.close();
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("SQLException:" + e.getMessage());
			}
		}
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
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "SELECT userID FROM users WHERE userName=" + id + ";";
			ResultSet rs = stmt.executeQuery(sql);

			while (rs.next()) {
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
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("SQLException:" + e.getMessage());
			}
		}

		if (count == 1)
			return true;
		else
			return false;
	}
}
