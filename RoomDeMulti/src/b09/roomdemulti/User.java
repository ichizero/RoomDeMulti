package b09.roomdemulti;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class User {
	private String name;
	private String pass;
	private String url;

	public User(String name,String pass,String url) {
		this.name = name;
		this.pass = pass;
		this.url = url;
	}

	public void save() throws SQLException {
		Connection conn;
		conn = DriverManager.getConnection(url);

		try {
			String tmp = "INSERT INTO users (name,pass,url) VALUES (?,?)";
			PreparedStatement stat = conn.prepareStatement(tmp);
			stat.setString(1, this.name);
			stat.setString(2, this.pass);
			stat.setString(3, this.url);
			stat.execute();
		}
		finally {
			conn.close();
		}

	}


}
