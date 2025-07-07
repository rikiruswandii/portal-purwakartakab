"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityDesc = void 0;
var UserActivity;
(function (UserActivity) {
    UserActivity[UserActivity["LOGOUT"] = 0] = "LOGOUT";
    UserActivity[UserActivity["LOGIN"] = 1] = "LOGIN";
    UserActivity[UserActivity["LOGIN_FAILED"] = 2] = "LOGIN_FAILED";
    UserActivity[UserActivity["UPDATE_PROFILE"] = 3] = "UPDATE_PROFILE";
    UserActivity[UserActivity["CHANGE_PASSWORD"] = 4] = "CHANGE_PASSWORD";
    UserActivity[UserActivity["CREATE_CATEGORY"] = 5] = "CREATE_CATEGORY";
    UserActivity[UserActivity["UPDATE_CATEGORY"] = 6] = "UPDATE_CATEGORY";
    UserActivity[UserActivity["DELETE_CATEGORY"] = 7] = "DELETE_CATEGORY";
    UserActivity[UserActivity["WRITE_ARTICLE"] = 8] = "WRITE_ARTICLE";
    UserActivity[UserActivity["EDIT_ARTICLE"] = 9] = "EDIT_ARTICLE";
    UserActivity[UserActivity["TAKEDOWN_ARTICLE"] = 10] = "TAKEDOWN_ARTICLE";
    UserActivity[UserActivity["ADD_REGENT"] = 11] = "ADD_REGENT";
    UserActivity[UserActivity["EDIT_REGENT"] = 12] = "EDIT_REGENT";
    UserActivity[UserActivity["DELETE_REGENT"] = 13] = "DELETE_REGENT";
    UserActivity[UserActivity["ADD_EVENT"] = 14] = "ADD_EVENT";
    UserActivity[UserActivity["EDIT_EVENT"] = 15] = "EDIT_EVENT";
    UserActivity[UserActivity["DELETE_EVENT"] = 16] = "DELETE_EVENT";
    UserActivity[UserActivity["EDIT_PAGE"] = 17] = "EDIT_PAGE";
    UserActivity[UserActivity["CREATE_USER"] = 18] = "CREATE_USER";
    UserActivity[UserActivity["UPDATE_USER"] = 19] = "UPDATE_USER";
    UserActivity[UserActivity["DELETE_USER"] = 20] = "DELETE_USER";
    UserActivity[UserActivity["UPDATE_SETTINGS"] = 21] = "UPDATE_SETTINGS";
    UserActivity[UserActivity["WRITE_NEWS"] = 22] = "WRITE_NEWS";
    UserActivity[UserActivity["EDIT_NEWS"] = 23] = "EDIT_NEWS";
    UserActivity[UserActivity["TAKEDOWN_NEWS"] = 24] = "TAKEDOWN_NEWS";
    UserActivity[UserActivity["ADD_INFOGRAPHIC"] = 25] = "ADD_INFOGRAPHIC";
    UserActivity[UserActivity["EDIT_INFOGRAPHIC"] = 26] = "EDIT_INFOGRAPHIC";
    UserActivity[UserActivity["DELETE_INFOGRAPHIC"] = 27] = "DELETE_INFOGRAPHIC";
    UserActivity[UserActivity["ADD_GOVERNMENT"] = 28] = "ADD_GOVERNMENT";
    UserActivity[UserActivity["EDIT_GOVERNMENT"] = 29] = "EDIT_GOVERNMENT";
    UserActivity[UserActivity["DELETE_GOVERNMENT"] = 30] = "DELETE_GOVERNMENT";
    UserActivity[UserActivity["ADD_SERVICE"] = 31] = "ADD_SERVICE";
    UserActivity[UserActivity["EDIT_SERVICE"] = 32] = "EDIT_SERVICE";
    UserActivity[UserActivity["DELETE_SERVICE"] = 33] = "DELETE_SERVICE";
    UserActivity[UserActivity["ADD_ANNOUNCEMENT"] = 34] = "ADD_ANNOUNCEMENT";
    UserActivity[UserActivity["EDIT_ANNOUNCEMENT"] = 35] = "EDIT_ANNOUNCEMENT";
    UserActivity[UserActivity["DELETE_ANNOUNCEMENT"] = 36] = "DELETE_ANNOUNCEMENT";
    UserActivity[UserActivity["ADD_WIFI"] = 37] = "ADD_WIFI";
    UserActivity[UserActivity["EDIT_WIFI"] = 38] = "EDIT_WIFI";
    UserActivity[UserActivity["DELETE_WIFI"] = 39] = "DELETE_WIFI";
    UserActivity[UserActivity["ADD_NATRES"] = 40] = "ADD_NATRES";
    UserActivity[UserActivity["EDIT_NATRES"] = 41] = "EDIT_NATRES";
    UserActivity[UserActivity["DELETE_NATRES"] = 42] = "DELETE_NATRES";
    UserActivity[UserActivity["ADD_OFFICER"] = 43] = "ADD_OFFICER";
    UserActivity[UserActivity["EDIT_OFFICER"] = 44] = "EDIT_OFFICER";
    UserActivity[UserActivity["DELETE_OFFICER"] = 45] = "DELETE_OFFICER";
    UserActivity[UserActivity["CREATE_TOKEN"] = 46] = "CREATE_TOKEN";
    UserActivity[UserActivity["REVOKE_TOKEN"] = 47] = "REVOKE_TOKEN";
})(UserActivity || (UserActivity = {}));
exports.UserActivityDesc = [
    'Keluar Akun',
    'Masuk ke Akun',
    'Gagal Masuk',
    'Memperbarui Profil',
    'Mengganti Kata Sandi',
    'Membuat Kategori',
    'Memperbarui Kategori',
    'Menghapus Kategori',
    'Menulis Artikel',
    'Menyunting Artikel',
    'Menghapus Artikel',
    'Menambahkan Bupati',
    'Memperbarui Bupati',
    'Menghapus Bupati',
    'Menambahkan Acara',
    'Memperbarui Acara',
    'Menghapus Acara',
    'Menyunting Halaman',
    'Membuat Pengguna',
    'Memperbarui Pengguna',
    'Menghapus Pengguna',
    'Memperbarui Pengaturan',
    'Menulis Berita',
    'Menyunting Berita',
    'Menghapus Berita',
    'Menambahkan Infografis',
    'Memperbarui Infografis',
    'Menghapus Infografis',
    'Menambahkan OPD',
    'Memperbarui OPD',
    'Menghapus OPD',
    'Menambahkan Layanan',
    'Memperbarui Layanan',
    'Menghapus Layanan',
    'Menambahkan Pengumuman',
    'Memperbarui Pengumuman',
    'Menghapus Pengumuman',
    'Menambahkan Wi-Fi Publik',
    'Memperbarui Wi-Fi Publik',
    'Menghapus Wi-Fi Publik',
    'Menambahkan SDA',
    'Memperbarui SDA',
    'Menghapus SDA',
    'Menambahkan Pejabat',
    'Memperbarui Pejabat',
    'Menghapus Pejabat',
    'Membuat Token',
    'Mencabut Token',
];
exports.default = UserActivity;
//# sourceMappingURL=UserActivity.js.map