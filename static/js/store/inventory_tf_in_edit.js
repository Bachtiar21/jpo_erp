document.addEventListener('DOMContentLoaded', function() {
    const listStatus = document.getElementById('listStatus');

    listStatus.addEventListener('change', function() {
        const selectedValue = listStatus.value;
        
        // Redirect to the corresponding page based on selected value
        if (selectedValue === 'received') {
            // Tampilkan SweetAlert konfirmasi
            Swal.fire({
                title: 'Konfirmasi',
                text: 'Apakah Anda yakin ingin melanjutkan ke halaman received?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Lanjutkan',
                cancelButtonText: 'Tidak'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Jika pengguna menekan "Ya", arahkan ke halaman yang sesuai
                    window.location.href = 'inventory_tf_in_received.html';
                }
            });
        }
    });
});
