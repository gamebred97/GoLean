export const getFoodNutrition = async (query) => {
  const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "x-app-id": import.meta.env.VITE_APP_ID,
      "x-app-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to fetch nutrition data");

  return res.json();
};

export const translateToEnglish = async (text) => {
    const api_key = 'AIzaSyA7c4fSqIXDNDgMeF33hi9ikdnRSISSDq4'
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${api_key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: "en",
    }),
  });

  if (!res.ok) throw new Error("Translation failed");

  const data = await res.json();
  return data.data.translations[0].translatedText;
};

export const getWallpaper = async () => {
  const url = await fetch("https://api.pexels.com/v1/search?query=bodybuilding&per_page=10", {
  headers: {
    Authorization: "nX26Y21midFdXy15Y4iuuXWjiMX9ujoQooyo4IhUUkEpfS3cS3q6Kb01"
  }
})
  const response = await url.json()
  return response
}