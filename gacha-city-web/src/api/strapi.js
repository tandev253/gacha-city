//gacha-city-web\src\api\strapi.js

const API_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "http://localhost:1337";
// ======== AUTH HELPERS (JWT) ========
function extractJwt(payload) {
  if (!payload) return null;

  // Strapi v4/v5 thường trả { jwt, user }
  if (typeof payload.jwt === "string")
    return payload.jwt;

  // Phòng trường hợp response có dạng { data: { jwt, user } }
  if (
    payload.data &&
    typeof payload.data.jwt === "string"
  ) {
    return payload.data.jwt;
  }

  // Một số custom có thể dùng "token"
  if (typeof payload.token === "string")
    return payload.token;
  if (
    payload.data &&
    typeof payload.data.token === "string"
  )
    return payload.data.token;

  return null;
}

function extractUser(payload) {
  if (!payload) return null;
  if (payload.user) return payload.user;
  if (payload.data && payload.data.user)
    return payload.data.user;
  return null;
}

function saveAuthToBrowser(payload) {
  const jwt = extractJwt(payload);
  const user = extractUser(payload);

  if (!jwt) {
    console.error(
      "Không tìm thấy JWT trong response login:",
      payload,
    );
    return;
  }

  // Lưu token để các API khác dùng
  localStorage.setItem("gc_jwt", jwt);
  localStorage.setItem("gc_access_token", jwt);

  if (user) {
    localStorage.setItem(
      "gc_user",
      JSON.stringify(user),
    );
  }

  console.log(
    "Đã lưu JWT vào localStorage:",
    jwt.slice(0, 20) + "...",
  );
}

// ================= NAVBAR =================
export async function getNavbar() {
  try {
    const res = await fetch(
      `${API_URL}/api/navbar-items?sort[0]=order:asc`,
    );

    if (!res.ok) {
      console.error(
        "Strapi navbar error:",
        res.status,
      );
      return [];
    }

    const json = await res.json();
    console.log("Strapi navbar json:", json);

    const data = Array.isArray(json.data)
      ? json.data
      : [];

    return data.map((item) => {
      const attrs =
        item?.attributes || item || {};

      return {
        id: item.id,
        name:
          attrs.title ||
          attrs.name ||
          attrs.TITLE ||
          "",
        url: attrs.url || attrs.slug || "#",
        children: [],
      };
    });
  } catch (err) {
    console.error("getNavbar error:", err);
    return [];
  }
}

// ================= DASHBOARD =================
export async function getDashboard() {
  try {
    const res = await fetch(
      `${API_URL}/api/dashboard`,
    );

    if (!res.ok) {
      console.error(
        "Strapi dashboard error:",
        res.status,
      );
      return {
        totalPlayers: 0,
        onlinePlayers: 0,
      };
    }

    const json = await res.json();
    console.log("Strapi dashboard json:", json);

    const attr =
      json.data?.attributes || json.data || {};

    const total =
      attr.totalPlayers ??
      attr.total ??
      attr.TOTAL ??
      0;

    const online =
      attr.onlinePlayers ??
      attr.online ??
      attr.ONLINE ??
      0;

    return {
      totalPlayers: total,
      onlinePlayers: online,
    };
  } catch (err) {
    console.error("getDashboard error:", err);
    return {
      totalPlayers: 0,
      onlinePlayers: 0,
    };
  }
}

// ================= NEWS / SLIDER =================
export async function getNews() {
  try {
    const res = await fetch(
      `${API_URL}/api/news-items?populate=img&sort[0]=createdAt:desc`,
    );

    if (!res.ok) {
      console.error(
        "Strapi news error:",
        res.status,
      );
      return [];
    }

    const json = await res.json();
    console.log("Strapi news json:", json);

    const data = Array.isArray(json.data)
      ? json.data
      : [];

    return data.map((item) => {
      const attrs =
        item?.attributes || item || {};

      const imgField =
        attrs.img || attrs.image || null;

      let imgUrl = "/placeholder.jpg";

      if (imgField?.data?.attributes?.url) {
        const raw = imgField.data.attributes.url;
        imgUrl = raw.startsWith("http")
          ? raw
          : `${API_URL}${raw}`;
      } else if (imgField?.url) {
        const raw = imgField.url;
        imgUrl = raw.startsWith("http")
          ? raw
          : `${API_URL}${raw}`;
      }

      return {
        id: item.id,
        title:
          attrs.title ||
          attrs.TITLE ||
          "Không có tiêu đề",
        desc:
          attrs.desc || attrs.description || "",
        img: imgUrl,
        slug: attrs.slug || "",
      };
    });
  } catch (err) {
    console.error("getNews error:", err);
    return [];
  }
}

// ================= DOANH NGHIỆP / BAN NGÀNH =================
export async function getBusinesses() {
  try {
    const res = await fetch(
      `${API_URL}/api/businesses?populate=logo&sort[0]=order:asc`,
    );

    if (!res.ok) {
      console.error(
        "Strapi businesses error:",
        res.status,
      );
      return [];
    }

    const json = await res.json();
    console.log("Strapi businesses json:", json);

    const data = Array.isArray(json.data)
      ? json.data
      : [];

    return data.map((item) => {
      const attrs =
        item?.attributes || item || {};

      const media =
        attrs.logo ||
        attrs.img ||
        attrs.image ||
        null;

      let logoUrl = "/placeholder.jpg";

      if (media?.data?.attributes?.formats) {
        const fm = media.data.attributes.formats;
        const raw =
          fm.medium?.url ||
          fm.small?.url ||
          fm.thumbnail?.url ||
          media.data.attributes.url ||
          "";

        if (raw) {
          logoUrl = raw.startsWith("http")
            ? raw
            : `${API_URL}${raw}`;
        }
      } else if (media?.data?.attributes?.url) {
        const raw = media.data.attributes.url;
        logoUrl = raw.startsWith("http")
          ? raw
          : `${API_URL}${raw}`;
      } else if (media?.url) {
        const raw = media.url;
        logoUrl = raw.startsWith("http")
          ? raw
          : `${API_URL}${raw}`;
      }

      return {
        id: item.id,
        name: attrs.name || "",
        description: attrs.description || "",
        slug: attrs.slug || "",
        buttonLabel:
          attrs.buttonLabel || "XEM CHI TIẾT",
        logoUrl,
      };
    });
  } catch (err) {
    console.error("getBusinesses error:", err);
    return [];
  }
}

// ================= ABOUT SECTION =================
export async function getAboutSection() {
  try {
    const res = await fetch(
      `${API_URL}/api/about-sections?populate=videoThumbnail`,
    );

    if (!res.ok) {
      console.error(
        "Strapi about-section error:",
        res.status,
      );
      return null;
    }

    const json = await res.json();
    console.log(
      "Strapi about-section json:",
      json,
    );

    const list = Array.isArray(json.data)
      ? json.data
      : [];
    if (list.length === 0) return null;

    const item = list[0];
    const attrs = item.attributes || item || {};

    return {
      id: item.id,
      title: attrs.title || "",
      subtitle: attrs.subtitle || "",
      description: attrs.description || "",
      faqButtonLabel:
        attrs.faqButtonLabel || "HỎI ĐÁP",
      guideButtonLabel:
        attrs.guideButtonLabel ||
        "HƯỚNG DẪN CHI TIẾT",
      socialFacebook: attrs.socialFacebook || "#",
      socialDiscord: attrs.socialDiscord || "#",
      videoThumbnail:
        attrs.videoThumbnail || null,
    };
  } catch (err) {
    console.error("getAboutSection error:", err);
    return null;
  }
}



/* ================= AUTH VỚI STRAPI ================= */

// Đăng nhập chỉ cần username + password
export async function authLogin(username, password) {
  try {
    const res = await fetch(
      `${API_URL}/api/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username, // dùng username hoặc email đều được
          password,
        }),
      },
    );

    const data = await parseJsonSafe(res);
    console.log("authLogin response data:", data);

    if (!res.ok) {
      return {
        ok: false,
        error:
          data?.error?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      };
    }

    // Lưu JWT + user vào localStorage
    saveAuthToBrowser(data);

    return { ok: true, data };
  } catch (err) {
    console.error("authLogin error:", err);
    return {
      ok: false,
      error: "Không kết nối được tới server.",
    };
  }
}
// PARSE JSON AN TOÀN

async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("JSON parse error:", text);
    return null;
  }
}
// GỬI OTP ĐĂNG KÝ
export async function sendRegisterOtp(
  username,
  email,
  password,
) {
  try {
    const res = await fetch(
      `${API_URL}/api/gc-auth/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      },
    );

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        (typeof data?.error === "string"
          ? data.error
          : "") ||
        "Gửi OTP thất bại (server trả về lỗi).";

      return { ok: false, error: msg };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("sendRegisterOtp error:", err);
    return {
      ok: false,
      error: "Không kết nối được tới server.",
    };
  }
}


export async function registerWithOtp(
  email,
  otp,
) {
  try {
    const res = await fetch(
      `${API_URL}/api/gc-auth/register-with-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      },
    );

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        (typeof data?.error === "string"
          ? data.error
          : "") ||
        "Xác thực OTP thất bại.";

      return { ok: false, error: msg };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("registerWithOtp error:", err);
    return {
      ok: false,
      error: "Không kết nối được tới server.",
    };
  }
}

// LẤY USER HIỆN TẠI TỪ JWT (Strapi Users)
export async function getCurrentUser() {
  const token = localStorage.getItem("gc_jwt");
  console.log("getCurrentUser token từ localStorage:", token);

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  try {
    const res = await fetch(
      `${API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const text = await res.text();
    console.log("/api/users/me status:", res.status, "body:", text);

    if (!res.ok) return null;

    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}


// ================= EVENTS (SỰ KIỆN) =================
export async function getEvents() {
  try {
    const res = await fetch(
      `${API_URL}/api/event-items?populate=img&sort[0]=createdAt:desc`,
    );

    if (!res.ok) {
      console.error("Strapi events error:", res.status);
      return [];
    }

    const json = await res.json();
    console.log("Strapi events json:", json);

    const data = Array.isArray(json.data) ? json.data : [];

    return data.map((item) => {
      const attrs = item?.attributes || item || {};

      const imgField = attrs.img || attrs.image || attrs.banner || null;
      let imgUrl = "";

      if (imgField?.data) {
        let fileAttr;
        if (Array.isArray(imgField.data)) {
          fileAttr = imgField.data[0]?.attributes;
        } else {
          fileAttr = imgField.data.attributes;
        }

        if (fileAttr) {
          const fm = fileAttr.formats || {};
          const raw =
            fm.medium?.url ||
            fm.small?.url ||
            fm.thumbnail?.url ||
            fileAttr.url ||
            "";

          if (raw) {
            imgUrl = raw.startsWith("http")
              ? raw
              : `${API_URL}${raw}`;
          }
        }
      } else if (imgField?.url) {
        const raw = imgField.url;
        imgUrl = raw.startsWith("http")
          ? raw
          : `${API_URL}${raw}`;
      }

      return {
        id: item.id,
        title: attrs.title || attrs.TITLE || "Không có tiêu đề",
        desc: attrs.desc || attrs.description || "",
        img: imgUrl || null,
        slug: attrs.slug || "",
      };
    });
  } catch (err) {
    console.error("getEvents error:", err);
    return [];
  }
}


/* ================= PROFILE ================= */

function buildImageUrl(img) {
  if (!img) return "/default-avatar.png";

  // media: { url, ... }
  if (img.url) {
    const raw = img.url;
    return raw.startsWith("http")
      ? raw
      : `${API_URL}${raw}`;
  }

  // REST populate: { data: { attributes: { url } } }
  if (img.data?.attributes?.url) {
    const raw = img.data.attributes.url;
    return raw.startsWith("http")
      ? raw
      : `${API_URL}${raw}`;
  }

  if (typeof img === "string") {
    return img.startsWith("http")
      ? img
      : `${API_URL}${img}`;
  }

  return "/default-avatar.png";
}

export async function getProfile() {
  const token =
    localStorage.getItem("gc_access_token") ||
    localStorage.getItem("gc_jwt");

  if (!token) throw new Error("NO_TOKEN");

  // ===== 1. Lấy thông tin user =====
  const userRes = await fetch(
    `${API_URL}/api/users/me?populate=avatar`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!userRes.ok) {
    console.log(
      "getProfile /users/me error:",
      await userRes.text(),
    );
    throw new Error("PROFILE_FAILED");
  }

  const rawUser = await userRes.json();

  const user = {
    id: rawUser.id,
    username: rawUser.username,
    email: rawUser.email,

    characterName: rawUser.characterName,
    discordName: rawUser.discordName,
    discordUser: rawUser.discordUser,
    avatarUrl: rawUser.avatar
      ? buildImageUrl(rawUser.avatar)
      : "/default-avatar.png",
  };

  // ===== helper format ngày/giờ từ createdAt =====
  function buildDateTimeDisplays(isoString) {
    if (!isoString) {
      return { dateDisplay: "", timeDisplay: "" };
    }
    const d = new Date(isoString);

  
    const date = d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); 
    const dateDisplay =
      "Ngày " + date.replace(/\//g, " - ");

    // 
    const time = d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }); 
    const timeDisplay = time.replace(/:/g, " : ");

    return { dateDisplay, timeDisplay };
  }

  // ===== 2. Lấy lịch sử đăng nhập =====
  let histories = [];

  try {
    const historyRes = await fetch(
      `${API_URL}/api/login-histories?filters[user][id][$eq]=${user.id}` +
        `&sort[0]=createdAt:desc&pagination[limit]=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (historyRes.ok) {
      const historyJson = await historyRes.json();
      console.log(
        "login histories json:",
        historyJson,
      );

      histories = (historyJson.data || []).map(
        (item, index) => {
          const attrs =
            item.attributes || item || {};

          // lấy createdAt từ cả item và attributes cho chắc
          const createdAt =
            attrs.createdAt ||
            item.createdAt ||
            null;

          const {
            dateDisplay: autoDate,
            timeDisplay: autoTime,
          } = buildDateTimeDisplays(createdAt);

          return {
            id: item.id ?? index,
            // nếu bạn có nhập sẵn trong Strapi thì dùng, không thì lấy auto từ createdAt
            dateDisplay:
              attrs.dateDisplay || autoDate,
            timeDisplay:
              attrs.timeDisplay || autoTime,
            city: attrs.city || "",
            country: attrs.country || "",
            os: attrs.os || "Windows", // fallback cho giống design
            durationDisplay:
              attrs.durationDisplay ||
              "01 : 57 : 46", // tạm fallback giống mockup
          };
        },
      );
    } else {
      console.warn(
        "getProfile histories error:",
        await historyRes.text(),
      );
    }
  } catch (err) {
    console.error(
      "getProfile histories err:",
      err,
    );
  }

  return { user, histories };
}