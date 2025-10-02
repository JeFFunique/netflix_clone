import { useEffect } from "react";
function Logout({onLogout, isLoggedOut}) {
     useEffect(() => {
    // trigger logout logic once the component mounts
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);
    return(
 <div style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>
      {isLoggedOut ? (
        <p>✅ Successfully logged out</p>
      ) : (
        <p>❌ Logout unsuccessful</p>
      )}
    </div>
    );
}

export default Logout;