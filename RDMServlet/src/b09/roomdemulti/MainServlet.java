package b09.roomdemulti;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class MainServlet
 */
@WebServlet("/test")
public class MainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private dbManager dbm;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MainServlet() {
		super();
		dbm = new dbManager();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String func = request.getParameter("func");

		StringBuilder builder = new StringBuilder();
		builder.append('{');

		// ユーザID
		String userId = null;
		// パスワード
		String password = null;
		// ユーザのマルチURL
		String userURL = null;
		// ルームID
		String roomId = null;
		// dbManager から受け取った文字列を格納
		String buff = "";

		// func によって処理を変える
		switch(func) {
		case "auth":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			buff = this.login(userId, password);
			builder.append(buff);
			break;
		case "regi":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			userURL = request.getParameter("userURL");
			buff = this.registerAccount(userId, password, userURL);
			builder.append(buff);
			break;
		case "addRequest":
			// userId = request.getParameter("userId");
			// userURL = request.getParameter("userURL");
			roomId = request.getParameter("roomId");
			String requestMessage = request.getParameter("requestMessage");
			buff = this.addRequest(roomId, requestMessage);
			builder.append(buff);
			// builder.append("\"userId\":\"").append(userId).append("\",");
			// builder.append("\"userURL\":\"").append(userId).append("\",");
			// builder.append("\"requestMessage\":\"").append(userURL).append("\"");
			break;
		case "getRequest":
			roomId = request.getParameter("roomId");
			buff = this.getRoomInf(roomId);
			builder.append(buff);
			break;
		case "getRoomList":
			userId = request.getParameter("userId");
			buff = this.getRoomList(userId);
			builder.append(buff);
		case "createRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			buff = addRoom(roomId);
			builder.append(buff);
			// builder.append("\"roomId\":\"").append(roomId).append("\"");
			break;
		case "joinRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			buff = joinRoom(roomId);
			builder.append(buff);
			// builder.append("\"roomId\":\"").append(roomId).append("\"");
			break;
		default:
			break;
		}

		// builder.append("\"integer\":\"").append(integer).append("\",");
		// builder.append("\"digit\":\"").append(String.valueOf(digit)).append("\"");
		builder.append('}');
		String json = builder.toString();
		System.out.println(json);
		response.setContentType("application/json");
		PrintWriter writer = response.getWriter();
		writer.append(json);
		writer.flush();
	}

	/**
	 * ログインを行うメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @return ログインが行われていれば true を返す
	 */
	protected String login(String id, String pass) {
		return dbm.admit(id, pass);
	}

	/**
	 * アカウントの作成を行うメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @param multiURL マルチURL
	 * @return アカウントの登録ができれば true を返す
	 */
	protected String registerAccount(String id, String pass, String multiURL) {
		// 既に存在するIDでなければ，アカウントをデータベースに追加する
		if (!dbm.isExistingID(id)) {
			return addAccount(id, pass, multiURL);
		} else {
			return "";
		}
	}

	/**
	 * ルーム一覧を表示するためのメソッド
	 *
	 * @param userId ユーザID
	 */
	protected String getRoomList(String userId) {
		return dbm.getRoomList(userId);
	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomId ルームID
	 */
	protected String addRoom(String roomId) {
		return dbm.addRoom(roomId);
	}

	/**
	 * ルームの情報を表示させるためのメソッド
	 * (クエストの募集一覧の表示など)
	 * 
	 * @param roomId ルームID
	 */
	protected String getRoomInf(String roomId) {
		return dbm.getRoomInf();
	}

	/**
	 * ルームに参加するためのメソッド
	 * ( Room クラスの userList にユーザを追加する)
	 *
	 * @param roomId ルームID
	 */
	protected String joinRoom(String roomId) {
		return dbm.joinRoom(roomId);
	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param roomId ルームID
	 * @param requestMessage 募集文
	 */
	protected String addRequest(String roomId, String requestMessage) {
		return dbm.addRequest(requestMessage, roomId);
	}
}
