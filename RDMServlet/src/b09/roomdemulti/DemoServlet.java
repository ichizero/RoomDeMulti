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
 * デモ用
 */
@WebServlet("/api")
public class DemoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private String tmpReqList = "{\"request\": \"イザナミ行こー！\", \"url\": \"#1\"}, {\"request\": \"マルチしよー！\", \"url\": \"#2\"}";
	private String tmpRoomList = "{\"roomId\": \"ルーム1\"}, {\"roomId\": \"るーむ2\"}";

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// System.out.println(request.getParameterMap());

		String func = request.getParameter("func");
		String json = this.branchProcessing(func, request);

		if (json.equals("error")) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} else {
			System.out.println(json);
			response.setContentType("application/json; charset=UTF-8");
			PrintWriter writer = response.getWriter();
			writer.append(json);
			writer.flush();
		}
	}

	protected String branchProcessing(String func, HttpServletRequest request) {
		String userId = request.getParameter("userId");
		String password = request.getParameter("password");
		String userURL = request.getParameter("userURL");
		String roomId = request.getParameter("roomId");
		String requestMessage = request.getParameter("requestMessage");

		switch (func) {
		case "authenticateUser":
			return "{ \"userId\": \"" + userId + "\", \"userURL\": " + "\"#oragon\"" + " }";
		case "registerUser":
			return "{ \"userId\": \"" + userId + "\", \"userURL\": \"" + userURL + "\" }";
		case "addRequest":
			tmpReqList += ", {\"request\": \"" + requestMessage + "\", \"url\": \"" + userURL + "\"}";
			return "{ \"requestList\": " + "[" + tmpReqList + "]" + " }";
		case "getRequest":
			return "{ \"requestList\": " + "[" + tmpReqList + "]" + " }";
		case "getRoomList":
			return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
		case "createRoom":
			tmpRoomList += ", {\"roomId\": \"" + roomId + "\"}";
			return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
		case "joinRoom":
			tmpRoomList += ", {\"roomId\": \"" + roomId + "\"}";
			return "{ \"roomList\": " + "[" + tmpRoomList + "]" + " }";
		default:
			return "error";
		}
	}
}
