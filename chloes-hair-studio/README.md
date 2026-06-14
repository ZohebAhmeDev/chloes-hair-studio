# Chloe's Hair Studio — Website

A clean, modern website for Chloe's Hair Studio (Redken), Parow Centre, Cape Town.

---

## 📁 Project structure

```
chloes-hair-studio/
├── index.html          ← Main page (all sections)
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── main.js         ← UI interactions, forms
│   └── firebase.js     ← Firebase read/write (bookings & reviews)
└── README.md
```

---

## 🚀 Deploy to GitHub Pages (step by step)

### 1. Create a GitHub account
Go to https://github.com and sign up (free).

### 2. Create a new repository
- Click **New repository**
- Name it: `chloes-hair-studio`
- Set to **Public**
- Click **Create repository**

### 3. Upload the files
- Click **Add file → Upload files**
- Drag the entire project folder contents in
- Commit with message: `Initial site`

### 4. Enable GitHub Pages
- Go to **Settings → Pages**
- Under Source: select **main** branch, root `/`
- Click **Save**
- Your site will be live at: `https://YOUR-USERNAME.github.io/chloes-hair-studio`

---

## 🔥 Connect Firebase (bookings & reviews)

### 1. Create a Firebase project
- Go to https://console.firebase.google.com
- Click **Add project** → name it `chloes-hair-studio`
- Disable Google Analytics (not needed) → Create project

### 2. Add a Web App
- Click the `</>` icon (Web)
- Register app: name it `chloes-hair-website`
- Copy the `firebaseConfig` object shown

### 3. Enable Firestore
- In Firebase console → **Build → Firestore Database**
- Click **Create database**
- Start in **test mode** (you can lock it down later)
- Choose a region close to South Africa (e.g. `europe-west1`)

### 4. Paste your config
Open `js/firebase.js` and replace:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### 5. Firestore collections created automatically
| Collection  | What gets stored                        |
|-------------|------------------------------------------|
| `bookings`  | name, phone, service, date, message      |
| `reviews`   | name, review, stars, service, approved   |

> 💡 To approve a review so it shows on the site:
> Go to Firebase console → Firestore → `reviews` collection → click a document → set `approved` to `true`

---

## ✏️ Easy content edits

| What to change            | Where                            |
|---------------------------|----------------------------------|
| Service prices            | `index.html` — `.service-price`  |
| Opening hours             | `index.html` — `.hours-table`    |
| Phone number              | `index.html` — two places        |
| Colours (gold, dark)      | `css/style.css` — `:root` vars   |
| Add/remove a service      | `index.html` — `.services-grid`  |

---

## 📞 Contact
**Chloe's Hair Studio**  
Shop F115, Parow Centre, Voortrekker Rd, Parow, Cape Town, 7500  
Tel: 021 820 5003
