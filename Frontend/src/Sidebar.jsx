import "./Sidebar.css";
function Sidebar() {
    return (
      <section className="sidebar">
       <button>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
        <span><i className="fa-solid fa-pen-to-square"></i></span>
       </button>

       <ul className="history">
        <ul>thread1</ul>
       <ul>thread2</ul>
       <ul>thread3</ul>
       </ul>

       <div className="sign">
          <p> By Rajit &hearts; </p>
       </div>
       
      </section>
    )
}

export default Sidebar;