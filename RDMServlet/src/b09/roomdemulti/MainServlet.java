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
 * サーブレット実装クラス
 * 
 * @author Yuto Murakami
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

		StringBuilder builder = new StringBuilder();
		builder.append('{');

		// クライアントサイドからどのような処理を行うのかを受け取る
		String func = request.getParameter("func");
		// dbManager で処理を行い，受け取った結果を格納
		String buff = this.branchProcessing(func, request);

		builder.append('}');
		String json = builder.toString();
		System.out.println(json);
		response.setContentType("application/json");
		PrintWriter writer = response.getWriter();
		writer.append(json);
		writer.flush();
	}

	/**
	 * 引数に与えられた内容によって処理を分岐させ，処理した結果を返す
	 */
	protected String branchProcessing(String func, HttpServletRequest request) {
		
		// ユーザID
		String userId = "";
		// パスワード
		String password = "";
		// ユーザのマルチURL
		String userURL = "";
		// ルームID
		String roomId = "";

		// func によって処理を変える
		switch(func) {
		case "auth":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			return this.login(userId, password);
		case "regi":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			userURL = request.getParameter("userURL");
			return this.registerAccount(userId, password, userURL);
		case "addRequest":
			roomId = request.getParameter("roomId");
			String requestMessage = request.getParameter("requestMessage");
			return this.addRequest(roomId, requestMessage);
		case "getRequest":
			roomId = request.getParameter("roomId");
			return this.getRoomInf(roomId);
		case "getRoomList":
			userId = request.getParameter("userId");
			return this.getRoomList(userId);
		case "createRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			return this.addRoom(roomId);
		case "joinRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			return this.joinRoom(roomId);
		default:
			return "";
		}
	}

	/**
	 * ログインを行うメソッド
	 *
	 * @param userId ユーザID
	 * @param password パスワード
	 * @return ログインが正しく行われていれば，ユーザIDとユーザのマルチURLの JSON を返す
	 */
	protected String login(String userId, String password) {
		return dbm.admit(userId, password);
	}

	/**
	 * アカウントの作成を行うメソッド
	 *
	 * @param userId ユーザID
	 * @param password パスワード
	 * @param userURL ユーザのマルチURL
	 * @return アカウントの登録ができれば，ユーザIDとユーザのマルチURLをJSON形式の文字列で返す
	 */
	protected String registerAccount(String userId, String password, String userURL) {
		// 既に存在するIDでなければ，アカウントをデータベースに追加する
		if (!dbm.isExistingID(userId)) {
			return addAccount(userId, password, userURL);
		} else {
			return "";
		}
	}

	/**
	 * ルーム一覧を表示するためのメソッド
	 *
	 * @param userId ユーザID
	 * @return ユーザの所属しているルーム一覧をJSON形式の文字列で返す
	 */
	protected String getRoomList(String userId) {
		return dbm.getRoomList(userId);
	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomId ルームID
	 * @return 正しく追加されれば，ルームIDをJSON形式の文字列で返す
	 */
	protected String addRoom(String roomId) {
		return dbm.addRoom(roomId);
	}

	/**
	 * ルームの情報を表示させるためのメソッド
	 * (クエストの募集一覧の表示など)
	 * 
	 * @param roomId ルームID
	 * @return 指定されたルームの募集文一覧をJSON形式の文字列で返す
	 */
	protected String getRoomInf(String roomId) {
		return dbm.getRoomInf(roomId);
	}

	/**
	 * ルームに参加するためのメソッド
	 * ( Room クラスの userList にユーザを追加する)
	 *
	 * @param roomId ルームID
	 * @return ルームに参加できれば，ルームIDをJSON形式の文字列で返す
	 */
	protected String joinRoom(String roomId) {
		return dbm.joinRoom(roomId);
	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param roomId ルームID
	 * @param requestMessage 募集文
	 * @return クエスト募集が正しく追加されれば，ルームの募集文一覧をJSON形式の文字列で返す
	 */
	protected String addRequest(String roomId, String requestMessage) {
		return dbm.addRequest(requestMessage, roomId);
	}
}
