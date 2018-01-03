package b09.roomdemulti;

public class dbManager {

	private Room room;
	private User user;
	private Request request;

	/**
	 * アカウント認証を行うためのメソッド
	 *
	 * @param id ユーザID
	 * @param pass パスワード
	 * @return ユーザIDとパスワードが一致していれば true を返す
	 */
	public boolean admit(String id, String pass) {
		if(!isExistingID(id)) System.out.println("正しいIDが入力されていません。");
		return false;
	}

	/**
	 * データベースにアカウントを追加するためのメソッド
	 *
	 * @param id
	 * @param pass
	 * @param multiURL
	 */
	public void addAccount(String id, String pass, String multiURL) {

	}

	/**
	 * ???
	 *
	 */
	public void getRoomList() {

	}

	/**
	 * ルームの追加を行うメソッド
	 *
	 * @param roomName
	 */
	public void addRoom(String roomName) {

	}

	/**
	 * ???
	 *
	 */
	public void getRoomInf() {

	}

	/**
	 * ルームに参加するためのメソッド
	 * ( Room クラスの userList にユーザを追加する)
	 *
	 */
	public void joinRoom() {

	}

	/**
	 * room.html でのクエスト募集の一覧で、クエスト名で絞り込みを行うためのメソッド
	 *
	 * @param questName クエスト名
	 */
	public void narrowByQuest(String questName) {

	}

	/**
	 * クエスト募集を追加するメソッド
	 *
	 * @param questName クエスト名
	 */
	public void addRequest(String questName) {

	}

	/**
	 * データベースに存在するIDか確認するためのメソッド
	 *
	 * @param id ユーザID
	 * @return データベースに存在すれば true を返す
	 */
	public boolean isExistingID(String id) {
		return false;
	}
}
