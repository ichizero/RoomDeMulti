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
	String database_path = getServletContext().getRealPath("WebContent/WEB-INF/database.db");

	/**
	 * アカウント認証を行うためのメソッド
	 * 引数に与えられた ユーザ名 と パスワード がデータベース上に存在するものと一致した場合，
	 * そのユーザの ユーザ名 と マルチURL をJSON形式の String で返す．
	 *
	 * @param id ユーザ名
	 * @param pass パスワード
	 * @return ユーザ名と(そのユーザの)マルチURLのJSON形式の String 
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
					frag = "\"userId\":\"" + uesrId + "\",\"userURL\":\"" + userURL + "\"";
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
							String text = rs.getString("requestText");
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
	 * データベース上に存在しないユーザ名であれば，
	 * データベース上にユーザ(ユーザ名 と パスワード と マルチURL)の追加を行う
	 *
	 * @param id ユーザ名
	 * @param pass パスワード
	 * @param multiURL マルチURL
	 * @return ユーザ名と(そのユーザの)マルチURLのJSON形式の String
	 */
	public String addAccount(String id, String pass, String multiURL) {
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO users (userName,userURL,userPass) VALUES ('" + id + "','" + multiURL + "','"
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
		return "\"userId\":\"" + id + "\",\"userURL\":\"" + multiURL + "\"";
	}

	/**
	 * 引数に与えられたユーザ名から，
	 * そのユーザの所属しているルームの一覧をJSON形式の String で返す．
	 * 
	 * @param userName ユーザ名
	 * @return 所属しているルーム一覧を表現するJSON形式の String
	 */
	public String getRoomList(String userName) {
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "SERECT * FROM requests WHERE userID=" + user.getUserID() + ";";
			ResultSet rs = stmt.executeUpdate(sql);
			String str = "";
			ArrayList<Integer> num = new ArrayList<Integer>();  
			while(rs.next()){
				num.add(rs.getInt(roomID));
			}
			str += "\"roomList\":[";

			
			for(int i = 0;i < num.size();i++){
				sql = "SERECT * FROM rooms WHERE roomID=" + num.get(i) + ";";
				rs = stmt.executeQuery(sql);
				str += "{\"roomName\":\"" + rs.getString(roomName) + "\"";
				if(requestList.size() - 1 == i){
					str += "}]";
				}
				else str += "},";
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
		return str;
	}

	/**
	 * 引数に与えられたルーム名から，
	 * データベース内に同じルーム名のものがなければ，
	 * データベースにルームの追加を行う．
	 *
	 * @param roomName ルーム名
	 * (@param userName ユーザ名)
	 */
	public StringConstant addRoom(String roomName) {
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO rooms(roomName) VALUES ('" + roomName + "');";
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
	 * 指定されたルーム名から，
	 * ルーム内にある募集文の一覧の情報を
	 * JSON形式の String で返す．
	 * 
	 * @param roomName ルーム名
	 * @return そのルームの募集文一覧
	 */
	public String getRoomInf(String roomName) {
		String str = "";
		ArrayList<Request> requestList = new ArrayList<Request>(); 
		
		for(int i = 0;i == rooms.size()-1;i++){
							if(rooms.get(i).getRoomName().equals(roomName)){
							requestList = rooms.get(i).getRequestList();
							room.addRequest(request);
						}
					}
					
					str += "\"requestList\":[";
					
					for(int i = 0;i < requestList.size();i++){
						sql = "SERECT * FROM users WHERE userID=" + requestList.get(i).getUserID() + ";";
						ResultSet rs = stmt.executeQuery(sql);
						str += "{\"userName\":\"" + rs.getString(userName) + "\",\"userURL\":\"" + rs.getString(userURL) + 
								"\",\"requestMessage\":\"" + requestList.get(i).getQuestName() + "\"";
						if(requestList.size() - 1 ==i){
							str += "}]";
						}
						else str += "},";
					}
		return str;
	}

	/**
	 * ルームへの参加を行う．
	 * ( Room クラスの userList にユーザを追加する )
	 * 追加ができれば，ルーム名を
	 * JSON形式の String で返す．
	 *
	 * @param roomName ルーム名
	 * (@param userName ユーザ名)
	 * @return ルーム名
	 */
	public String joinRoom(String roomName) {
		
	}

	/**
	 * データベースにクエスト募集を追加する．
	 * 追加ができれば，指定されたルーム名の募集一覧を 
	 * JSON形式の String で返す．
	 *
	 * @param requestMessage 募集文
	 * @param roomName ルーム名
	 * @return 募集分の一覧をJSON形式の String で返す
	 */
	protected String addRequest(String requestMessage, String roomName) {
		try {
			String str = "";
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);
			int roomsIDx;

			for(int i = 0;i == rooms.size() - 1;i++){
				if(rooms.get(i).getRoomName().equals(roomName)){
					roomsIDx = rooms.get(i).getRoomID();
				}
			}

			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO requests (roomID,userID,requestText) VALUES (" + roomsIDx + "," + user.getUserID() + ",'" + requestMessage + "');";
			int num = stmt.executeUpdate(sql);

			request = new Request(user.getUserID(),requestMessage);
			ArrayList<Request> requestList = new ArrayList<Request>(); 

			for(int i = 0;i == rooms.size()-1;i++){
				if(rooms.get(i).getRoomName().equals(roomName)){
					requestList = rooms.get(i).getRequestList();
					room.addRequest(request);
				}
			}
			
			str += "\"requestList\":[";
			
			for(int i = 0;i < requestList.size();i++){
				sql = "SERECT * FROM users WHERE userID=" + requestList.get(i).getUserID() + ";";
				ResultSet rs = stmt.executeQuery(sql);
				str += "{\"userName\":\"" + rs.getString(userName) + "\",\"userURL\":\"" + rs.getString(userURL) + 
						"\",\"requestMessage\":\"" + requestList.get(i).getQuestName() + "\"";
				if(requestList.size() - 1 ==i){
					str += "}]";
				}
				else str += "},";
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
		return str;
	}

	/**
	 * データベースに存在するユーザ名かどうかを返す．
	 *
	 * @param id ユーザ名
	 * @return データベースに存在すれば true を返す
	 */
	public boolean isExistingID(String id) {
		int num = 0;
		try {
			Class.forName("org.sqlite.JDBC").newInstance();
			conn = DriverManager.getConnection("jdbc:sqlite:" + database_path);

			Statement stmt = conn.createStatement();
			String sql = "SELECT COUNT(*) FROM users WHERE userName='" + id + "';";
			num = stmt.executeQuery(sql); 

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

		if (num == 1)
			return true;
		else
			return false;
	}
}
