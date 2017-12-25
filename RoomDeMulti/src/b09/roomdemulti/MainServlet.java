package b09.roomdemulti;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class MainServlet
 */
@WebServlet("/")
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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	protected void login() {
		dbm.admit();
	}

	protected void newAccount() {
		dbm.addAccount();
	}

	protected void getRoomInf() {
		dbm.getRoomInf();
	}

	protected void joinRoom() {
		dbm.joinRoom();
	}

	protected void narrowByQuest() {
		dbm.narrowByQuest();
	}

	protected void addRequest() {
		dbm.addRequest();
	}
}
