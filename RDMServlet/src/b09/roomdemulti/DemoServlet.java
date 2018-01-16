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

import b09.roomdemulti.DBMTest;


/**
 * デモ用
 */
@WebServlet("/demo")
public class DemoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private String tmpReqList = "{\"requestMessage\": \"イザナミ行こー！\", \"userName\": \"ゆー\", \"userURL\": \"http://localhost:8080/room#1\"}, {\"requestMessage\": \"マルチしよー！\", \"userName\": \"みー\", \"userURL\": \"http://localhost:8080/room#2\"}";
    private String tmpRoomList = "{\"roomName\": \"ルーム1\"}, {\"roomName\": \"るーむ2\"}";

    private DBMTest dbm;

    public DemoServlet() {
        this.dbm = new DBMTest();
    }

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

    protected String branchProcessing(String func, HttpServletRequest request)
            throws Exception, ClassNotFoundException, InstantiationException, IllegalAccessException, SQLException {
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        String userURL = request.getParameter("userURL");
        String roomName = request.getParameter("roomName");
        String requestMessage = request.getParameter("requestMessage");

        switch (func) {
        case "authenticateUser":
            return this.dbm.authenticateUser(userName, password);
        case "registerUser":
            return this.dbm.registerUser(userName, password, userURL);
        case "addRequest":
            tmpReqList += ", {\"requestMessage\": \"" + requestMessage + "\", \"userName\": \"" + userName
                    + "\", \"userURL\": \"" + userURL + "\"}";
            return "{ \"requestList\": " + "[" + tmpReqList + "]" + " }";
        case "getRequest":
            return "{ \"requestList\": " + "[" + tmpReqList + "]" + " }";
        case "getRoomList":
            return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
        case "createRoom":
            tmpRoomList += ", {\"roomName\": \"" + roomName + "\"}";
            return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
        case "joinRoom":
            tmpRoomList += ", {\"roomName\": \"" + roomName + "\"}";
            return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
        default:
        throw new Exception("Error");
        }
    }
}
