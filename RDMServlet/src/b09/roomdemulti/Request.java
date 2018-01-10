package b09.roomdemulti;

public class Request {
	private int userID;
	private String questName;

	public Request(int userID,String questName) {
		this.userID = userID;
		this.questName = questName;
	}
	
	public int getUserID(){
		return userID;
	}

	public String getQuestName(){
		return questName;
	}
}
