document.addEventListener("DOMContentLoaded", function () {
  const countriesSelect = document.getElementById("countries");
  const getCountryInfoButton = document.getElementById("getCountryInfo");
  const getHolidaysButton = document.getElementById("getHolidays");
  const countryInfoDiv = document.getElementById("countryInfo");
  const holidaysDiv = document.getElementById("holidays");
  const yearInput = document.getElementById("year");

  fetch("https://date.nager.at/api/v3/AvailableCountries")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.countryCode;
        option.text = country.name;
        countriesSelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Mamlakatlarni olishda xatolik yuz berdi:", error)
    );

  getCountryInfoButton.addEventListener("click", () => {
    const countryCode = countriesSelect.value;
    if (countryCode) {
      fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`)
        .then((response) => response.json())
        .then((data) => {
          countryInfoDiv.innerHTML = `
                        <h2>Country Information</h2>
                        <p><strong>Name:</strong> ${data.commonName}</p>
                        <p><strong>Official Name:</strong> ${data.officialName}</p>
                        <p><strong>Region:</strong> ${data.region}</p>
                        <p><strong>SubRegion:</strong> ${data.subRegion}</p>
                        <p><strong>Population:</strong> ${data.population}</p>
                        <img src="${data.countryFlag}" alt="Flag of ${data.commonName}" width="100">
                    `;
        })
        .catch((error) =>
          console.error(
            "Mamlakat malumotlarini olishda xatolik yuz berdi:",
            error
          )
        );
    } else {
      countryInfoDiv.innerHTML = "<p>Iltimos, mamlakatni tanlang.</p>";
    }
  });

  getHolidaysButton.addEventListener("click", () => {
    const countryCode = countriesSelect.value;
    const year = yearInput.value;
    if (countryCode && year) {
      fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
      )
        .then((response) => response.json())
        .then((data) => {
          holidaysDiv.innerHTML = "<h2> Davlat bayramlari</h2>";
          if (data.length > 0) {
            const ul = document.createElement("ul");
            data.forEach((holiday) => {
              const li = document.createElement("li");
              li.textContent = `${holiday.date}: ${holiday.localName} (${holiday.name})`;
              ul.appendChild(li);
            });
            holidaysDiv.appendChild(ul);
          } else {
            holidaysDiv.innerHTML +=
              "<p>Tanlangan yil va mamlakat uchun hech qanday davlat bayramlari topilmadi.</p>";
          }
        })
        .catch((error) =>
          console.error("Bayram kunlarini olishda xatolik yuz berdi:", error)
        );
    } else {
      holidaysDiv.innerHTML =
        "<p>Iltimos, mamlakatni tanlang va joriy yilni kiriting.</p>";
    }
  });
});
