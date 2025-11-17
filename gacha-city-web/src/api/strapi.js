//gacha-city-web\src\api\strapi.js

const API_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

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
    const res = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: username, // dùng username để login
        password,
      }),
    });

    const data = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        ok: false,
        error:
          data?.error?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      };
    }

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
      return {
        ok: false,
        error:
          data?.error ||
          "Gửi OTP thất bại (server trả về lỗi).",
      };
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
      return {
        ok: false,
        error:
          data?.error || "Xác thực OTP thất bại.",
      };
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
  if (!token) return null;

  try {
    const res = await fetch(
      `${API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}
