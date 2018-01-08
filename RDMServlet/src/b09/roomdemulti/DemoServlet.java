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

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// System.out.println(request.getParameterMap());

		String func = request.getParameter("func");
		String json = this.branchProcessing(func, request);

		response.setCharacterEncoding("UTF-8");

		if (json.equals("error")) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} else {
			System.out.println(json);
			// response.setContentType("application/json");
			PrintWriter writer = response.getWriter();
			writer.append(json);
			writer.flush();
		}
	}

	protected String branchProcessing(String func, HttpServletRequest request) {
		String userId = "";
		String password = "";
		String userURL = "";
		String roomId = "";
		String requestMessage = "";

		switch (func) {
		case "authenticateUser":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			return "{ \"userId\": \"" + userId + "\", \"userURL\": " + "\"#oragon\"" + " }";
		case "registerUser":
			userId = request.getParameter("userId");
			password = request.getParameter("password");
			userURL = request.getParameter("userURL");
			return "{ \"userId\": \"" + userId + "\", \"userURL\": \"" + userURL + "\" }";
		case "addRequest":
			userId = request.getParameter("userId");
			userURL = request.getParameter("userURL");
			roomId = request.getParameter("roomId");
			requestMessage = request.getParameter("requestMessage");
			return "{ \"requestList\": " + "[{\"request\": \"" + requestMessage + "\", \"url\": \"" + userURL + "\"}]" + " }";
		case "getRequest":
			roomId = request.getParameter("roomId");
			return "{ \"requestList\": " + "[{\"request\": \"イザナミ行こー！\", \"url\": \"#1\"}, {\"request\": \"マルチしよー！\", \"url\": \"#2\"}]"
					+ " }";
		case "getRoomList":
			userId = request.getParameter("userId");
			return "{ \"roomList\": " + "[{\"roomId\": \"ルーム1\"}, {\"roomId\": \"るーむ2\"}]" + " }";
		case "createRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			return "{ \"roomList\": " + "[{\"roomId\": \"" + roomId + "\"}]" + " }";
		case "joinRoom":
			roomId = request.getParameter("roomId");
			userId = request.getParameter("userId");
			return "{ \"roomList\": " + "[{\"roomId\": \"" + roomId + "\"}]" + " }";
		default:
			return "error";
		}
	}
}
