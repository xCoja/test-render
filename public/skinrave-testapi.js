document.addEventListener("DOMContentLoaded", () => {
    fetch('/.netlify/functions/skinraveLeaderboard')
    .then(response => response.json())
    .then(data => {
        const leaderboard = data.referrals;

        // Sort leaderboard by wagerAmount first, then by acquireTime if wagerAmount is zero
        leaderboard.sort((a, b) => {
            if (b.wagerAmount !== a.wagerAmount) {
                return b.wagerAmount - a.wagerAmount; // Sort by wagered amount
            }
            return a.acquireTime - b.acquireTime; // Sort by acquireTime (oldest first)
        });

        const leaderboardBody = document.querySelector(".leaderboard-body");
        leaderboardBody.innerHTML = ""; // Clear previous content

        // Loop through the users and create leaderboard rows
        leaderboard.forEach((user, index) => {
            if (user && user.imageUrl && user.displayName) {
                const row = document.createElement("div");
                row.classList.add("leaderboard-row");

                const wageredParts = user.wagerAmount ? user.wagerAmount.toFixed(2).split('.') : ['0', '00'];

                row.innerHTML = `
                    <div class="cell rank-cell">
                        <span class="rank">#${index + 1}</span>
                        <img src="${user.imageUrl}" class="avatar-img" alt="Avatar of ${user.displayName}">
                        <span class="name">${user.displayName}</span>
                    </div>
                    <div class="cell">
                        <div class="wagered">
                            <img src="rain-coin.svg" style="max-width:15px;margin-right: 5px">
                            ${wageredParts[0]}<span style="opacity: .5;">.${wageredParts[1]}</span>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="prize">0</div>
                    </div>
                `;

                leaderboardBody.appendChild(row);
            } else {
                console.error("Missing user data for other users.");
            }
        });
    })
    .catch(error => console.error("Error fetching leaderboard data:", error));
});
