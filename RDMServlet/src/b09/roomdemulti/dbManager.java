package b09.roomdemulti;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.sql.Date;

import org.json.JSONObject;
import org.json.JSONArray;

public class dbManager {

	private Room room;//ルーム
	private User user;//ユーザ
	private Request request;//リクエスト
	Connection conn = null;
	// private static final String DB_PATH = "jdbc:sqlite:webapps/ROOT/WEB-INF/database.db";
	private static final String DB_PATH = "jdbc:sqlite:WebContent/WEB-INF/database.db";

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
			String str = "";

			try {
				Class.forName("org.sqlite.JDBC").newInstance();
				conn = DriverManager.getConnection(database_path);

				Statement stmt = conn.createStatement();

				//user情報を取る
				String sql = "SELECT * FROM users WHERE userName='" + id + "';";
				ResultSet rs = stmt.executeQuery(sql);
				JSONArray jsonArray = convertToJSON(rs);

				int userID = rs.getInt("userID");
				String userName = rs.getString("userName");
				String userURL = rs.getString("userURL");
				String userPass = rs.getString("userPass");

				if (userPass.equals(pass)) {
					str = "\"userId\":\"" + uesrId + "\",\"userURL\":\"" + userURL + "\"";
					user = new User(userID, userName, userPass, userURL);
					rooms = new ArrayList<Room>();

					//ユーザの入っているルームを取る
					sql = "SELECT roomID FROM requests WHERE userID='" + userID + "';";
					rs = stmt.executeQuery(sql);
					ArrayList<Integer> num = new ArrayList<Integer>();
					while (rs.next()) {
						num.add(rs.getInt("roomID"));
					}

					//ユーザの入っているルーム情報の構築
					for (int i = 0; i == num.size() - 1; i++) {

						//room作成
						sql = "SELECT * FROM rooms WHERE roomID=" + num.get(i) + ";";
						rs = stmt.executeQuery(sql);
						String roomName = rs.getString("roomName");
						room = new Room(rs.getInt("roomID"), roomName);

						//requestを日付降順で取る
						sql = "SELECT * FROM requests WHERE roomID=" + num.get(i) + "ORDER BY date DESC;";
						rs = stmt.executeQuery(sql);

						//roomにuserListとRequestListのデータを追加
						while (rs.next()) {
							userID = rs.getInt("userID");
							String text = rs.getString("requestText");
							Date date = rs.getDate("date");
							request = new Request(userID, text, date);
							room.addRequest(request);

							sql = "SELECT * FROM users WHERE userID=" + userID + ";";
							ResultSet rs2 = stmt.executeQuery(sql);
							userName = rs2.getString("userName");
							userURL = rs2.getString("userURL");
							userPass = rs2.getString("userPass");
							User user2 = new User(userID, userName, userPass, userURL);
							room.addUser(user2);
						}
						//roomsリストにroomを格納
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
			return str;
		}
	}

	/**
	 * データベースにアカウントを追加するためのメソッド
	 * データベース上に存在しないユーザ名であれば，
	 * データベース上にユーザ(ユーザ名 と パスワード と マルチURL)の追加を行う
	 *
	 * @param userName ユーザ名
	 * @param password パスワード
	 * @param userURL マルチURL
	 * @return ユーザ名と(そのユーザの)マルチURLのJSON形式の String
	 */
	public String addAccount(String userName, String password, String userURL)
			throws Exception, ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
		if (isExistingUserName(userName)) {
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

	/**
	 * 引数に与えられたユーザ名から，
	 * そのユーザの所属しているルームの一覧をJSON形式の String で返す．
	 * 
	 * @param userName ユーザ名
	 * @return 所属しているルーム一覧を表現するJSON形式の String
	 */
	public String getRoomList(String userName) {

		Class.forName("org.sqlite.JDBC").newInstance();
		conn = DriverManager.getConnection(database_path);
		Statement stmt = conn.createStatement();
		JSONObject resultJson = new JSONObject();
		JSONArray JA = new JSONArray();

		//userの入っているroomのroomIDを取得
		String sql = "SERECT * FROM users WHERE userName='" + userName + "';";
		ResultSet rs = stmt.executeUpdate(sql);
		int userID = rs.getInt(userID);
		sql = "SERECT * FROM requests WHERE userID=" + userID + ";";
		rs = stmt.executeUpdate(sql);
		ArrayList<Integer> num = new ArrayList<Integer>();
		while (rs.next()) {
			num.add(rs.getInt(roomID));
		}

		for (int i = 0; i < num.size(); i++) {

			//roomIDからroomNameを取る
			sql = "SERECT * FROM rooms WHERE roomID=" + num.get(i) + ";";
			rs = stmt.executeQuery(sql);
			JA.append(rs.getString("roomName"));
		}
		resultJson.setJSONArray(roomList, JA);

		stmt.close();

		if (conn != null) {
			conn.close();
		}

		return resultJson.toString();
	}

	/**
	 * 引数に与えられたルーム名から，
	 * データベース内に同じルーム名のものがなければ，
	 * データベースにルームの追加を行う．
	 *
	 * @param roomName ルーム名
	 * (@param userName ユーザ名)////////////////////////////////////////////ここ！/////////////////////////////////////////////////////
	 */
	public String addRoom(String roomName, String userName) {
		if (isExistingIRoomName(roomName)) {
			throw new Exception("Room name is already in use.");
		}

		Class.forName("org.sqlite.JDBC").newInstance();
		conn = DriverManager.getConnection(database_path);
		Statement stmt = conn.createStatement();
		JSONObject resultJson = new JSONObject();

		//新しいroomをDBに追加
		String sql = "INSERT INTO rooms(roomName) VALUES ('" + roomName + "');";
		stmt.executeUpdate(sql);
		sql = "SERECT * FROM rooms WHERE roomName='" + roomName + "';";
		ResultSet rs = stmt.executeQuery(sql);
		int roomID = rs.getInt("roomID");
		sql = "SERECT * FROM users WHERE userName='" + userName + "';";
		rs = stmt.executeQuery(sql);
		int userID = rs.getInt("userID");
		sql = "INSERT INTO requests(roomID,userID) VALUES (" + roomID + "," + userID + ");";
		stmt.executeUpdate(sql);
		resultJson.put("roomName", roomName);

		stmt.close();

		if (conn != null) {
			conn.close();
		}
		return resultJson.toString();

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

		for (int i = 0; i == rooms.size() - 1; i++) {
			if (rooms.get(i).getRoomName().equals(roomName)) {
				requestList = rooms.get(i).getRequestList();
				room.addRequest(request);
			}
		}

		str += "\"requestList\":[";

		for (int i = 0; i < requestList.size(); i++) {
			sql = "SERECT * FROM users WHERE userID=" + requestList.get(i).getUserID() + ";";
			ResultSet rs = stmt.executeQuery(sql);
			str += "{\"userName\":\"" + rs.getString(userName) + "\",\"userURL\":\"" + rs.getString(userURL)
					+ "\",\"requestMessage\":\"" + requestList.get(i).getQuestName() + "\"";
			if (requestList.size() - 1 == i) {
				str += "}]";
			} else
				str += "},";
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
	 * (@param userName ユーザ名)////////////////////////////////////////////ここ！/////////////////////////////////////////////////////
	 * @return ルーム名
	 */
	public String joinRoom(String roomName) {

		//roomIDとuserIDを紐付けるためにrequestsに追加
		String sql = "INSERT INTO requests (roomID,userID) VALUES (" + roomsIDx + "," + user.getUserID() + "');";
	}

	/**
	 * データベースにクエスト募集を追加する．
	 * 追加ができれば，指定されたルーム名の募集一覧を 
	 * JSON形式の String で返す．
	 *
	 * (@param userName ユーザ名)////////////////////////////////////////////ここ！/////////////////////////////////////////////////////
	 * (@param userURL ユーザのマルチURL)////////////////////////////////////////////ここ！/////////////////////////////////////////////////////
	 * @param requestMessage 募集文
	 * @param roomName ルーム名
	 * @return 募集分の一覧をJSON形式の String で返す
	 */
	protected String addRequest(String userName,String userURL,String requestMessage, String roomName) {

		Class.forName("org.sqlite.JDBC").newInstance();
		conn = DriverManager.getConnection(database_path);
		int roomID;
		int userID;
		JSONObject resultJson;
		JSONArray JA;

		Statement stmt = conn.createStatement();
		Date date = new Date(System.currentTimeMillis());

		String sql = "SERECT * FROM rooms WHERE roomName='" + roomName + "';";
		ResultSet rs = stmt.executeQuery(sql);
		roomID = rs.getInt("roomID");
		sql = "SERECT * FROM users WHERE userName='" + userName + "';";
		userID = rs.getInt("userID");

		//updateへ
		sql = "UPDATE requests SET requestText='" + requestMessage + ",date=" + date + "' WHERE roomID=" + roomID + " and userID=" + userID + ";";
		stmt.executeUpdate(sql);

		sql = "SERECT * FROM requests WHERE roomID=" + roomID + "ORDER BY date DESC;";
		rs = stmt.executeQuery(sql);

		JA = new JSONArray();
		while(rs.next()){
			userID = rs.getInt("userID");
			sql = "SERECT * FROM users WHERE userID='" + userID + "';";
			ResultSet rs2 = stmt.executeQuery(sql);
			resultJson = new JSONObject();
			resultJson.put("userName",rs2.getString("userName"));
			resultJson.put("userURL",rs2.getString("userURL"));
			resultJson.put("requestMessage",rs.getString("requestText"));
			JA.append(ressultJson);
		}

		resultJson = new JSONObject();
		resultJson.setJSONArray("requestList",JA);

		stmt.close();

		if (conn != null) {
			conn.close();
		}
		return resultJson.toString();
	}

	/**
	 * データベースに存在するユーザ名かどうかを返す．
	 *
	 * @param userName ユーザ名
	 * @return データベースに存在すれば true を返す
	 */
	public boolean isExistingIUserName(String userName)
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

	public boolean isExistingIRoomName(String roomName)
			throws ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
		int existCount = 0;

		Class.forName("org.sqlite.JDBC").newInstance();
		Connection conn = DriverManager.getConnection(DB_PATH);
		Statement state = conn.createStatement();

		String sql = "SELECT COUNT(*) FROM rooms WHERE roomName='" + roomName + "';";
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
}
