import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { getProfile, updateProfile } from "../../api/UserApi";
import "./Profile.css";

function Profile() {
    const { token, user, setUser } = useUser();

    console.log("TOKEN:", token);
    console.log("AUTH HEADER:", {
        Authorization: `Bearer ${token}`
    });

    const [form, setForm] = useState({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: ""
    });

    const [editField, setEditField] = useState({
        username: false,
        email: false,
        password: false
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!token) return;

            const data = await getProfile(token);

            if (data) {
                setForm(prev => ({
                    ...prev,
                    username: data.username || "",
                    email: data.email || ""
                }));

                setUser(data);
            }
        };

        loadProfile();
    }, [token, setUser]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleEdit = (field) => {
        setEditField(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSaveField = async (field) => {
        const payload = {};

        if (field === "username") {
            payload.username = form.username;
        }

        if (field === "email") {
            payload.email = form.email;
        }

        if (field === "password") {
            if (!form.currentPassword || !form.newPassword) {
                alert("Please fill both password fields");
                return;
            }
            payload.currentPassword = form.currentPassword;
            payload.newPassword = form.newPassword;
        }

        const res = await updateProfile(token, payload);

        if (res) {
            alert(`${field} updated!`);

            if (field === "username") {
                setUser({
                    ...user,
                    username: form.username
                });
            }

            if (field === "email") {
                setUser({
                    ...user,
                    email: form.email
                });
            }

            setEditField(prev => ({
                ...prev,
                [field]: false
            }));

            if (field === "password") {
                setForm(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: ""
                }));
            }
        }
    };

    return (
        <div className="profile-wrapper">

            <div className="profile-box">
                <h2 className="profile-title">My Profile</h2>

                {/* USERNAME */}
                <div className="profile-row">
                    <label>Username</label>

                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        disabled={!editField.username}
                        className="profile-input"
                    />

                    {!editField.username ? (
                        <button onClick={() => toggleEdit("username")}>
                            Edit
                        </button>
                    ) : (
                        <button onClick={() => handleSaveField("username")}>
                            Save
                        </button>
                    )}
                </div>

                {/* EMAIL */}
                <div className="profile-row">
                    <label>Email</label>

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editField.email}
                        className="profile-input"
                    />

                    {!editField.email ? (
                        <button onClick={() => toggleEdit("email")}>
                            Edit
                        </button>
                    ) : (
                        <button onClick={() => handleSaveField("email")}>
                            Save
                        </button>
                    )}
                </div>

                {/* PASSWORD */}
                <div className="profile-row">
                    <label>Password</label>

                    {!editField.password ? (
                        <button onClick={() => toggleEdit("password")}>
                            Change Password
                        </button>
                    ) : (
                        <div className="password-box">
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Current Password"
                                className="profile-input"
                            />

                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="profile-input"
                            />

                            <button onClick={() => handleSaveField("password")}>
                                Save Password
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Profile;