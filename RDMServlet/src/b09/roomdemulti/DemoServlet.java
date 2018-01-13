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

import b09.roomdemulti.DBMTest;

/**
 * デモ用
 */
@WebServlet("/api")
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

        String func = request.getParameter("func");
        String json = this.branchProcessing(func, request);

        response.setContentType("application/json; charset=UTF-8");

        if (json.matches("Error.*")) {
            System.out.println(json);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, json);
        } else {
            System.out.println(json);
            PrintWriter writer = response.getWriter();
            writer.append(json);
            writer.flush();
        }
    }

    protected String branchProcessing(String func, HttpServletRequest request) {
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
            return "Error";
        }
    }
}
