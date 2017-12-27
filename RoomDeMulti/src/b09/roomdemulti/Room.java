package b09.roomdemulti;

import java.util.ArrayList;

public class Room {
	private int roomID;
	private String roomName;
	private ArrayList<User> userList;
	private ArrayList<Request> requwstList;

	public Room(int roomID,String roomName,ArrayList<User> userList,ArrayList<Request> requestList) {
		this.roomID = roomID;
		this.roomName = roomName;
		this.userList = userList;
		this.requwstList = requestList;
	}

}
