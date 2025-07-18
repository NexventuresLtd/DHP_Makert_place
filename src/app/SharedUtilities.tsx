export const Logout_action = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    window.location.href = "/";
};

export const Logout_action_admin = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userInfo");
    // Redirect to admin login page
    window.location.href = "/admin/login";
};