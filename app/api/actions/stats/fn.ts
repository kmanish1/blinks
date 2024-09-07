import { createCanvas } from "canvas";

// Function to generate heatmap
export function generateHeatmap(dates: number[]): string {
  if (!dates || dates.length === 0) {
    console.error("No valid dates provided for heatmap generation");
    return "";
  }

  try {
    const canvas = createCanvas(2600, 800); // Increased canvas height to accommodate the legend
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    const cellSize = 32;
    const cellPadding = 4;
    const colorScale = [
      "#e0f7fa", // 0 (no activity)
      "#b2ebf2", // 1-2
      "#80deea", // 3-5
      "#4dd0e1", // 6-10
      "#26c6da", // 11-20
      "#00acc1", // 21- ...
    ];
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Determine the current month and create a dynamic month array
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const nextMonthIndex = (currentMonthIndex + 1) % 12;
    const months = [
      ...allMonths.slice(nextMonthIndex),
      ...allMonths.slice(0, nextMonthIndex),
    ];

    // Create a map to count transactions per day
    const dateCounts = dates.reduce((acc, timestamp) => {
      if (typeof timestamp !== "number" || isNaN(timestamp)) {
        console.warn(`Invalid timestamp encountered: ${timestamp}`);
        return acc;
      }
      const seconds =
        timestamp > 1e10 ? Math.floor(timestamp / 1000) : timestamp;
      const date = new Date(seconds * 1000);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date created from timestamp: ${seconds}`);
        return acc;
      }
      const dateString = date.toISOString().split("T")[0];
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(dateCounts).length === 0) {
      throw new Error("No valid dates found in the provided data");
    }

    type FormattedDate = { date: string; count: number };

    // Transform dateCounts to the desired array format
    const formattedDates: FormattedDate[] = Object.entries(dateCounts).map(
      ([date, count]) => ({
        date: date.replace(/-/g, "/"), // Convert 'YYYY-MM-DD' to 'YYYY/MM/DD'
        count,
      })
    );

    // Sort the array by date in ascending order
    formattedDates.sort(
      (a, b) =>
        new Date(a.date.replace(/\//g, "-")).getTime() -
        new Date(b.date.replace(/\//g, "-")).getTime()
    );

    // Calculate total transactions, active days, longest streak, and average transactions per active day
    const totalTransactions = formattedDates.reduce(
      (sum, { count }) => sum + count,
      0
    );
    const activeDays = formattedDates.length;
    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate = new Date(formattedDates[0].date);

    for (const { date } of formattedDates) {
      const currentDate = new Date(date);
      const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        currentStreak = 1;
      }
      previousDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    const avgTransactionsPerActiveDay = totalTransactions / activeDays;

    // Adjust start date to be one year ago from the next month
    const startDate = new Date(
      now.getFullYear() - 1,
      (now.getMonth() + 1) % 12,
      1
    );

    // Fill background
    ctx.fillStyle = "#f6f8fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = "#24292e";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Transaction Activity Heatmap", 50, 70);
    ctx.font = "24px Arial";

    // Draw stats on the right side
    const statsX = 2000;
    const statsYStart = 150;
    const statsLineHeight = 50;

    ctx.fillText(
      `Total Transactions: ${totalTransactions}`,
      statsX,
      statsYStart
    );
    ctx.fillText(
      `Active Days: ${activeDays}`,
      statsX,
      statsYStart + statsLineHeight
    );
    ctx.fillText(
      `Longest Streak: ${longestStreak} days`,
      statsX,
      statsYStart + 2 * statsLineHeight
    );
    ctx.fillText(
      `Avg Transactions/Day: ${Math.floor(avgTransactionsPerActiveDay)}`,
      statsX,
      statsYStart + 3 * statsLineHeight
    );

    // Draw month labels
    for (let i = 0; i < 12; i++) {
      const monthLabelX = i * (cellSize + cellPadding) * 4.4 + 120;
      ctx.fillStyle = "#586069";
      ctx.fillText(months[i], monthLabelX, 170);
    }

    let currentDate = new Date(startDate);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Set to end of the day

    let x = 120;
    let y = currentDate.getDay() * (cellSize + cellPadding) + 200;

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const count = dateCounts[dateString] || 0;
      const colorIndex = getColorIndex(count);

      ctx.fillStyle = colorScale[colorIndex];
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, 4);
      ctx.fill();

      y += cellSize + cellPadding;
      if (y >= 7 * (cellSize + cellPadding) + 200) {
        y = 200;
        x += cellSize + cellPadding;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Draw legend
    const legendX = 120;
    const legendY = canvas.height - 100; // Moved the legend down to avoid overlap
    ctx.fillStyle = "#586069";
    ctx.fillText("Less", legendX, legendY);
    for (let i = 0; i < colorScale.length; i++) {
      ctx.fillStyle = colorScale[i];
      ctx.beginPath();
      ctx.roundRect(legendX + 80 + i * 60, legendY - 30, 48, 48, 4);
      ctx.fill();
    }
    ctx.fillStyle = "#586069";
    ctx.fillText("More", legendX + 80 + colorScale.length * 60 + 20, legendY);

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating heatmap:", error);
    return "";
  }
}

function getColorIndex(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  if (count <= 20) return 4;
  return 5;
}
