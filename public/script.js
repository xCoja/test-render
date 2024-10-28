document.addEventListener("DOMContentLoaded", () => { 
    fetch('https://leaderboard-render.onrender.com/api/leaderboard')
    .then(response => response.json())
    .then(data => {
        let leaderboard = data.referrals;

        // Sort leaderboard by wagerAmount first, then by acquireTime if wagerAmount is zero
        leaderboard.sort((a, b) => {
            if (b.wagerAmount !== a.wagerAmount) {
                return b.wagerAmount - a.wagerAmount; // Sort by wagered amount
            }
            return a.acquireTime - b.acquireTime; // Sort by acquireTime (oldest first)
        });

        // Limit to the top 10 users
        leaderboard = leaderboard.slice(0, 10);

        const topThreeSection = document.querySelector(".top-three");
        const leaderboardBody = document.querySelector(".leaderboard-body");

        leaderboardBody.innerHTML = ""; // Clear previous content
        topThreeSection.innerHTML = ""; // Clear previous content

        // Check if there are enough users to show in top 3
        const topThreeUsers = leaderboard.slice(0, 3); // Get up to 3 users

        // Create the cards for Rank 2, Rank 1, and Rank 3 in that specific order
        const displayOrder = [1, 0, 2]; // Middle: Rank 1, Left: Rank 2, Right: Rank 3

        displayOrder.forEach((rankIndex, displayIndex) => {
            const user = topThreeUsers[rankIndex];
            if (user && user.imageUrl && user.displayName) {
                const topUserCard = document.createElement("div");

                if (displayIndex === 0) {
                    topUserCard.classList.add("card", "first-card");  // Rank 2 user (left side)
                } else if (displayIndex === 1) {
                    topUserCard.classList.add("card", "second-card");  // Rank 1 user (middle)
                } else if (displayIndex === 2) {
                    topUserCard.classList.add("card", "third-card");  // Rank 3 user (right side)
                }

                const rank = rankIndex === 0 ? 1 : (rankIndex === 1 ? 2 : 3);

                // Populate top user cards
topUserCard.innerHTML = `
<div class="card-header">
    <span class="badge ${rank === 1 ? "badge-first" : rank === 2 ? "badge-second" : "badge-third"}">
        ${rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
    </span>
    <div class="avatar-container avatar-${rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}">
        <img src="${user.imageUrl}" alt="leader">
    </div>
</div>
<div class="card-body">
    <div class="leader-name">${user.displayName}</div>
    <div class="leader-wagered">WAGERED:</div>
    <div class="leader-amount">
        <img src="chicken-coin.png" style="max-width: 25px; vertical-align: middle; margin-bottom: 2px;">
        ${user.wagerAmount ? user.wagerAmount.toFixed(2).split('.')[0] : '0'}<span style="opacity: .5;">.${user.wagerAmount ? user.wagerAmount.toFixed(2).split('.')[1] : '00'}</span>
    </div>
    <div class="leader-points"><img src="chicken-coin.png" style="max-width: 25px; vertical-align: middle; margin-bottom: 5px;">${rank === 1 ? 400 : rank === 2 ? 200 : 100}</div>
</div>
`;


                topThreeSection.appendChild(topUserCard);
            } else {
                console.error("Missing user data for top 3 users.");
            }
        });

        // Loop through the rest of the users and assign different prizes for ranks 4 to 10
        leaderboard.slice(3).forEach((user, index) => {
            if (user && user.imageUrl && user.displayName) {
                const row = document.createElement("div");
                row.classList.add("leaderboard-row");

                const wageredParts = user.wagerAmount ? user.wagerAmount.toFixed(2).split('.') : ['0', '00'];
                const rank = index + 4; // Ranks start at 4

                // Define prizes for ranks 4 to 10
                let prize = 0;
                if (rank === 4) prize = 50;
                else if (rank === 5) prize = 25;
                else if (rank >= 6 && rank <= 10) prize = 5;

                row.innerHTML = `
                    <div class="cell rank-cell">
                        <span class="rank">#${rank}</span>
                        <img src="${user.imageUrl}" class="avatar-img" alt="Avatar of ${user.displayName}">
                        <span class="name">${user.displayName}</span>
                    </div>
                    <div class="cell">
                        <div class="wagered">
                            <img src="chicken-coin.png" style="max-width:15px;margin-right: 5px">
                            ${wageredParts[0]}<span style="opacity: .5;">.${wageredParts[1]}</span>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="prize"><img src="chicken-coin.png" style="max-width:20px;margin-right: 5px">${prize}</div>
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
