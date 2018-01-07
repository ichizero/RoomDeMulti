package b09.roomdemulti;

import java.io.IOException;
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

		String userId;
		String password;
		String userURL;
		switch(func) {
		case "regi":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			userURL = request.getParameter("userURL");
			this.newAccount(userId, password, userURL);
			break;
		case "auth":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			this.login(userId, password);
			break;
		case "getRequest":
			this.getRoomInf();
			break;
		case "addRequest":
			String requestMessage = request.getParameter("requestMessage");
			String roomName = request.getParameter("roomName");
			userId = request.getParameter("userId");
			this.addRequest(questName, roomName);
			break;
		default:
			break;
		}
		
		// StringBuilder builder = new StringBuilder();
		// builder.append('{');
		// builder.append("\"integer\":\"").append(integer).append("\",");
		// builder.append("\"digit\":\"").append(String.valueOf(digit)).append("\"");
		// builder.append('}');
		// String json = builder.toString();
		// System.out.println(json);
		// response.setContentType("application/json");
		// PrintWriter writer = response.getWriter();
		// writer.append(json);
		// writer.flush();
	}

	/**
	 * ログインを行うメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 */
	protected void login(String id, String pass) {
		// 認証を行う
		if(dbm.admit(id, pass)) {
			// 認証が通れば if 文内を実行
		}
	}

	/**
	 * アカウントの作成を行うメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @param multiURL マルチURL
	 */
	protected void newAccount(String id, String pass, String multiURL) {
		// 既に存在するIDでなければ，アカウントをデータベースに追加する
		if(!dbm.isExistingID(id)) {
			dbm.addAccount(id, pass, multiURL);
		} else {
			System.out.println("既にアカウントが存在します。");
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
	protected void addRequest(String requestMessage, String roomName, String userID) {
		dbm.addRequest(requestMessage, roomName, userID);
	}
}
