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

import java.sql.SQLException;

/**
 * サーブレット実装クラス
 * 
 * @author Yuto Murakami
 */
@WebServlet("/test")
public class MainServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private DBManager dbm;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public MainServlet() {
        super();
        this.dbm = new DBManager();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");

        String func = request.getParameter("func");

        try {
            String json = this.branchProcessing(func, request);
            System.out.println(json);
            PrintWriter writer = response.getWriter();
            writer.append(json);
            writer.flush();
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * 引数に与えられた内容によって処理を分岐させ，
     * DBManagerインスタンスに処理を委譲する．
     * @return 該当する処理があればJSON形式のString
     *         処理にエラーがあれば"Error"を含むString
     *         処理がなければ"Error"
     */
    protected String branchProcessing(String func, HttpServletRequest request)
            throws Exception, ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {

        // POSTパラメータから値をセット．存在しなければnull
        String userName = request.getParameter("userName"); // ユーザ名
        String password = request.getParameter("password"); // パスワード
        String userURL = request.getParameter("userURL"); // ユーザのマルチURL
        String roomName = request.getParameter("roomName"); // ルーム名
        String requestMessage = request.getParameter("requestMessage"); // リクエスト文

        // func によって処理を変える
        switch (func) {
        case "authenticateUser":
            return this.dbm.admit(userName, password);
        case "registerUser":
            return this.dbm.addAccount(userName, password, userURL);
        case "addRequest":
            return this.dbm.addRequest(userName, userURL, requestMessage, roomName);
        case "getRequest":
            return this.dbm.getRoomInf(roomName);
        case "getRoomList":
            return this.dbm.getRoomList(userName);
        case "createRoom":
            return this.dbm.addRoom(roomName, userName);
        case "joinRoom":
            return this.dbm.joinRoom(roomName, userName);
        default:
            throw new Exception("Error");
        }
    }
}
