import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            // Updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.name) return "U";
        return user.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sidebar-footer">
                {/* Profile Menu */}
                <div className="profile-container">
                    <button
                        className="profile-button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className="profile-avatar">
                            {getUserInitials()}
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">{user?.name || "User"}</span>
                            <span className="profile-email">{user?.email || ""}</span>
                        </div>
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>

                    {showProfileMenu && (
                        <>
                            <div
                                className="profile-menu-overlay"
                                onClick={() => setShowProfileMenu(false)}
                            ></div>
                            <div className="profile-menu">
                                <div className="menu-item" onClick={() => alert('Settings coming soon!')}>
                                    <i className="fa-solid fa-gear"></i>
                                    <span>Settings</span>
                                </div>
                                <div className="menu-item" onClick={() => alert('Upgrade coming soon!')}>
                                    <i className="fa-solid fa-cloud"></i>
                                    <span>Upgrade plan</span>
                                </div>
                                <div className="menu-item logout" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    <span>Log out</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="sign">
                    <p>By ApnaCollege &hearts;</p>
                </div>
            </div>
        </section>
    );
}

export default Sidebar;
