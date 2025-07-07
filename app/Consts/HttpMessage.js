"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMessage = {
    200: 'Permintaan telah berhasil diproses.',
    204: 'Konten berhasil dihapus.',
    400: 'Badan permintaan tidak berisi data yang valid.',
    401: 'Kunci API tidak dikenal. Harap periksa kunci API kamu dan coba lagi.',
    403: 'Kamu tidak mendapatkan akses ke sumber daya ini.',
    404: 'Sepertinya titik akhir yang kamu cari tidak dapat ditemukan.',
    406: 'Permintaan yang kamu minta saat ini belum didukung.',
    429: 'Permintaan kunci API kamu telah melampaui batas penggunaan.',
    500: 'Terjadi kesalahan tidak terduga di sisi server.',
};
exports.default = HttpMessage;
//# sourceMappingURL=HttpMessage.js.map