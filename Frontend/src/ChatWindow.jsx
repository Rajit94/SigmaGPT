import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import { useAuth } from "./AuthContext.jsx";
import { API_BASE_URL } from "./config.js";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const getUserInitial = () => {
        if (!user?.name) return "U";
        return user.name.charAt(0).toUpperCase();
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <button type="button" className="userIcon" onClick={handleProfileClick}>
                        {getUserInitial()}
                    </button>
                </div>
            </div>
            {
                isOpen &&
                <>
                    <div className="dropDownOverlay" onClick={() => setIsOpen(false)}></div>
                    <div className="dropDown">
                        <div className="dropDownHeader">
                            <p>{user?.name || "User"}</p>
                            <span>{user?.email || "user@sigmagpt.ai"}</span>
                        </div>
                        <div className="dropDownItem disabled" aria-disabled="true">
                            <i className="fa-solid fa-gear"></i>
                            <div>
                                <p>Settings</p>
                                <span>Preferences coming soon</span>
                            </div>
                        </div>
                        <div className="dropDownItem disabled" aria-disabled="true">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                            <div>
                                <p>Upgrade plan</p>
                                <span>Pro features preview</span>
                            </div>
                        </div>
                        <div className="dropDownItem logout" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            <div>
                                <p>Log out</p>
                                <span>End current session</span>
                            </div>
                        </div>
                    </div>
                </>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
