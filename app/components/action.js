"use server";

const PORT = process.env.NEXT_PUBLIC_SITE_URL ;


//LOGIN
export async function loginAdmin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await fetch(`${PORT}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Login failed:", data.message);
      return {
        success: data.isAdmin,
        message: data.message || "Login failed!",
      };
    }
    console.log(`${data.message}`);
    return {
      AdminStatus: data.isAdmin,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    console.error("Error during login (action.js):", error);
    return {
      success: data.isAdmin,
      message: "Network error occurred",
    };
  }
}

//LOGOUT
export async function logoutAdmin() {
  try {
    const response = await fetch(`${PORT}/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json()
    if (!response.ok) {
      console.error("Logout failed");
      return {
        message: data.message,
        success: false,
      };
    }
    return {
      message: data.message,
      success: true
    }
  } catch (error) {
    console.error("Error during logout (action.js):", error);
  }
}

//CREATE
export async function SendData(siteData) {
  // console.log("in action.js: ", siteData)
  try {
    const response = await fetch(`${PORT}/api/web`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: siteData.get("name"), // Fixed: was 'siteName', now 'name'
        url: siteData.get("url"), // Fixed: was 'siteUrl', now 'url'
        description: siteData.get("description"), // Fixed: was 'siteUrl', now 'url'
        tags: JSON.parse(siteData.get("categories")), // This parses it back to an array
      }),
      credentials: "include", // Important to include cookies in requests
    });

    const result = await response.json();
    if (!response.ok) {
      console.warn("Failed to send data:", result.message);
    } else {
      console.info("Data added successfully:");
    }
    return result;
  } catch (error) {
    console.error("Error sending data:", error);
    // return `Error sending data: ${error.message}`;
  }
}

//UPDATE
export async function UpdateData(id, NewData) {
  // console.log("sending data to update:", NewData)
  try {
    const response = await fetch(`${PORT}/api/web`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        web_id: id,
        name: NewData.name,
        url: NewData.url,
        description: NewData.description,
        tags: NewData.tags
      }),
      credentials: "include", // Important to include cookies in requests
    });

    if (!response.ok) {
      console.error("Failed to update data:", response.statusText);
      return `Failed to update data: ${response.statusText}`;
    }

    const result = await response.json();
    console.log(result.message, result.status);
    return true;
  } catch (error) {
    console.error("Error updating data:", error);
    return `Error updating data: ${error.message}`;
  }
}

//DELETE
export async function DeleteData(id) {
  try {
    // console.log(`going to delete for ID: ${id}`)
    const response = await fetch(`${PORT}/api/web`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ web_id: id }),
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      console.warn("Failed to delete data:", result.message);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error During Deletion data:", error);
  }
}


