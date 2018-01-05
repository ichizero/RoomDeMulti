package b09.roomdemulti;

public class User {
	private int userID;
	private String userName;
	private String pass;
	private String url;

	public User(int userID,String name,String pass,String url) {
		this.userID = userID;
		this.userName = name;
		this.pass = pass;
		this.url = url;
	}

	public String getUserName(){
		return userName;
	}
}
