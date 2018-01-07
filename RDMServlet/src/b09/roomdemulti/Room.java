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

	public int getRoomID(){
		return roomID;
	}

	public void addUser(User user){
		userList.add(user);
	}

	public void addRequest(Request request){
		requestList.add(request);
	}
}
