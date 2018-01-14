package b09.roomdemulti;

import java.util.ArrayList;

public class Room {
	private int roomID;
	private String roomName;
	private ArrayList<User> userList;
	private ArrayList<Request> requestList;

	public Room(int roomID,String roomName) {
		this.roomID = roomID;
		this.roomName = roomName;
		userList = new ArrayList<User>();
		requestList = new ArrayList<Request>();
	}
}
