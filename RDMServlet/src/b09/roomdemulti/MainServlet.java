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
	private List roomList;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MainServlet() {
		super();
		dbm = new dbManager();
		roomList = new ArrayList<Room>();
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

		// func によって処理を変える
		switch(func) {
		case "auth":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			// if (this.login(userId, password)) {
				builder.append("\"userId\":\"").append(userId).append("\",");
				builder.append("\"userURL\":\"").append(userURL).append("\"");
			// }
			break;
		case "regi":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			userURL = request.getParameter("userURL");
			// if (this.isRegistered(userId, password, userURL)) {
				builder.append("\"userId\":\"").append(userId).append("\",");
				builder.append("\"userURL\":\"").append(userURL).append("\"");
			// }
			break;
		case "addRequest":
			userId = request.getParameter("userId");
			userURL = request.getParameter("userURL");
			roomId = request.getParameter("roomId");
			String requestMessage = request.getParameter("requestMessage");
			// this.addRequest(questName, roomName);
			builder.append("\"userId\":\"").append(userId).append("\",");
			builder.append("\"userURL\":\"").append(userId).append("\",");
			builder.append("\"requestMessage\":\"").append(userURL).append("\"");
			break;
		case "getRequest":
			roomId = request.getParameter("roomId");
			// this.getRoomInf();
			builder.append("\"userId\":\"").append(userId).append("\",");
			builder.append("\"userURL\":\"").append(userId).append("\",");
			builder.append("\"requestMessage\":\"").append(userURL).append("\"");
			break;
		case "createRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			builder.append("\"roomId\":\"").append(roomId).append("\"");
			break;
		case "joinRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			builder.append("\"roomId\":\"").append(roomId).append("\"");
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
	protected boolean login(String id, String pass) {
		// 認証を行う
		if (dbm.admit(id, pass)) {
			// 認証が通れば if 文内を実行
			return true;
		}
		return false;
	}

	/**
	 * アカウントの作成を行うメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @param multiURL マルチURL
	 * @return アカウントの登録ができれば true を返す
	 */
	protected boolean isRegistered(String id, String pass, String multiURL) {
		// 既に存在するIDでなければ，アカウントをデータベースに追加する
		if (!dbm.isExistingID(id)) {
			dbm.addAccount(id, pass, multiURL);
			return true;
		} else {
			System.out.println("既にアカウントが存在します。");
			return false;
		}
	}

	/**
	 * ルーム一覧を表示するためのメソッド
	 *
	 */
	protected void getRoomList() {
		// buffer 使って roomList のルーム名を全て追加していく
	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomName ルーム名
	 */
	protected void addRoom(String roomName) {
		dbm.addRoom(roomName);
	}

	/**
	 * ルームの情報を表示させるためのメソッド
	 * (クエストの募集一覧の表示など)
	 * 
	 */
	protected void getRoomInf() {

		dbm.getRoomInf();
	}

	/**
	 * ルームに参加するためのメソッド
	 * ( Room クラスの userList にユーザを追加する)
	 *
	 * @param roomName ルーム名
	 */
	protected void joinRoom(String roomName) {
		dbm.joinRoom(roomName);
	}

	/**
	 * room.html でのクエスト募集の一覧で、クエスト名で絞り込みを行うためのメソッド
	 *
	 * @param questName クエスト名
	 */
	protected void narrowByQuest(String questName) {
		dbm.narrowByQuest(questName);
	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param requestMessage 募集文
	 * @param roomName ルーム名
	 * @param userId ユーザID
	 */
	protected void addRequest(String requestMessage, String roomName) {
		dbm.addRequest(requestMessage, roomName);
	}
}
