//gacha-city-api\src\api\strapi.js

const API_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

// Lấy menu từ Strapi và build thành cây name/url/children
export async function getNavbar() {
  try {
    const res = await fetch(
      `${API_URL}/api/navbar-items?populate=parent&pagination[pageSize]=100&sort[0]=order:asc`,
    );

    if (!res.ok) {
      console.error(
        "Strapi navbar error:",
        res.status,
      );
      return [];
    }

    const json = await res.json();

    // Bóc data từ Strapi v4
    const flatItems = (json.data || []).map(
      (item) => ({
        id: item.id,
        // ⚠️ Strapi của bạn dùng field "title" chứ không phải "name"
        name:
          item.attributes.title ||
          item.attributes.name ||
          "",
        url: item.attributes.url,
        order: item.attributes.order ?? 0,
        parentId:
          item.attributes.parent?.data?.id ||
          null,
      }),
    );

    // Map id -> node
    const byId = {};
    flatItems.forEach((i) => {
      byId[i.id] = { ...i, children: [] };
    });

    // Build cây (root + children)
    const roots = [];
    flatItems.forEach((i) => {
      const node = byId[i.id];
      if (i.parentId) {
        const parent = byId[i.parentId];
        if (parent) {
          parent.children.push(node);
        } else {
          // nếu lỗi parent không tồn tại thì cho lên root
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sắp xếp theo order
    const sortByOrder = (a, b) =>
      (a.order || 0) - (b.order || 0);
    roots.sort(sortByOrder);
    roots.forEach((r) =>
      r.children.sort(sortByOrder),
    );

    return roots;
  } catch (err) {
    console.error("getNavbar error:", err);
    return [];
  }
}

// Lấy stat dashboard: totalPlayers / onlinePlayers
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
    const attr = json.data?.attributes || {};

    return {
      totalPlayers: attr.totalPlayers ?? 0,
      onlinePlayers: attr.onlinePlayers ?? 0,
    };
  } catch (err) {
    console.error("getDashboard error:", err);
    return {
      totalPlayers: 0,
      onlinePlayers: 0,
    };
  }
}


export default {
  routes: [
    {
      method: "GET",
      path: "/gc-profile/me",
      handler: "gc-profile.me",
      config: {
        auth: true, // bắt buộc đã đăng nhập (Bearer JWT)
        policies: [],
        middlewares: [],
      },
    },
  ],
};