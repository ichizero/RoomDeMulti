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
        this.dbm = new dbManager();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        StringBuilder builder = new StringBuilder();
        builder.append('{');

        // クライアントサイドからどのような処理を行うのかを受け取る
        String func = request.getParameter("func");
        // dbManager で処理を行い，受け取った結果を格納
        String buff = this.branchProcessing(func, request);

        if (buff.matches(".*" + "error" + ".*")) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } else {
            builder.append(buff);
            builder.append('}');
            String json = builder.toString();
            System.out.println(json);
            response.setContentType("application/json; charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.append(json);
            writer.flush();
        }
    }

    /**
     * 引数に与えられた内容によって処理を分岐させ，
     * DBManagerインスタンスに処理を委譲する．
     * @return 該当する処理があればJSON形式のString
     *         処理にエラーがあれば"error"を含むString
     *         処理がなければ"error"
     */
    protected String branchProcessing(String func, HttpServletRequest request) {

        // POSTパラメータから値をセット．存在しなければnull
        String userName = request.getParameter("userName"); // ユーザ名
        String password = request.getParameter("password"); // パスワード
        String userURL = request.getParameter("userURL");   // ユーザのマルチURL
        String roomName = request.getParameter("roomName"); // ルーム名
        String requestMessage = request.getParameter("requestMessage"); // リクエスト文

        // func によって処理を変える
        switch (func) {
        case "authenticateUser":
            return this.dbm.login(userName, password);
        case "registerUser":
            // TODO：ユーザが登録済みかチェックする処理はDBM上で処理されるべき
            return this.registerAccount(userName, password, userURL);
        case "addRequest":
            return this.dbm.addRequest(roomName, requestMessage);
        case "getRequest":
            return this.dbm.getRoomInf(roomName);
        case "getRoomList":
            return this.dbm.getRoomList(userName);
        case "createRoom":
            return this.dbm.addRoom(roomName);
        case "joinRoom":
            // return this.dbm.joinRoom(roomName);
            return "error";
        default:
            return "error";
        }
    }

    /**
     * アカウントの作成を行うメソッド
     *
     * @param userName ユーザID
     * @param password パスワード
     * @param userURL ユーザのマルチURL
     * @return アカウントの登録ができれば，ユーザIDとユーザのマルチURLをJSON形式の文字列で返す
     */
    protected String registerAccount(String userName, String password, String userURL) {
        // 既に存在するIDでなければ，アカウントをデータベースに追加する
        if (!dbm.isExistingID(userName)) {
            return addAccount(userName, password, userURL);
        } else {
            return "error";
        }
    }
}
