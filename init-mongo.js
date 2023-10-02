db.createUser(
    {
        user: "weather-admin",
        pwd: "empty",
        roles: [
            {
                role: "readWrite",
                db: "weather-app"
            }
        ]
    }
);
db.createCollection("users");