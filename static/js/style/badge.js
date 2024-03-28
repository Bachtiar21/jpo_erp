// Function to get badge markup based on the status
export function getBadgeStatus(status) {
    switch (status) {
      case 'active':
        return '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Active</span>';
      case 'suspend':
        return '<span class="badge-red" style="font-size: 10px; background-color: #fa0202; color: white; padding: 5px 10px; border-radius: 5px;">Suspend</span>';
      default:
        return "<span>Tidak Ada Status</span>";
    }
}

// Function to get badge markup based on the status bank
export function getBadgeBank(status) {
  switch (status) {
    case 'used':
      return '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Dipakai</span>';
    case 'not':
      return '<span class="badge-red" style="font-size: 10px; background-color: #fa0202; color: white; padding: 5px 10px; border-radius: 5px;">Tidak Dipakai</span>';
    default:
      return "<span>Tidak Ada Status</span>";
  }
}

// Function to get badge markup based on the roles
export function getBadgeRoles(status) {
  switch (status) {
    case 'superadmin':
      return '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Super Admin</span>';
    case 'store':
      return '<span class="badge-blue" style="font-size: 10px; background-color: #1934e3; color: white; padding: 5px 10px; border-radius: 5px;">Store</span>';
    case 'convection':
      return '<span class="badge-yellow" style="font-size: 10px; background-color: #f7f305; color: white; padding: 5px 10px; border-radius: 5px;">Convection</span>';
    default:
      return "<span>Tidak Ada Status</span>";
  }
}

// Function to get bage markup based on the roles
export function getBadgePO(status) {
  switch (status) {
    case 'draft':
      return '<span class="badge-primary" style="font-size: 10px; background-color: #0000FF; color: white; padding: 5px 10px; border-radius: 5px;">Draft</span>';
    case 'received':
      return '<span class="badge-info" style="font-size: 10px; background-color: #5bc0de; color: white; padding: 5px 10px; border-radius: 5px;">Received</span>';
    case 'paid':
      return '<span class="badge-yellow" style="font-size: 10px; background-color: #f0ad4e; color: white; padding: 5px 10px; border-radius: 5px;">Paid</span>';
    case 'done':
      return '<span class="badge-success" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Done</span>';
    default:
      return "<span>Tidak Ada Status</span>";
  }
}

export function getBadgePayment(status) {
  switch (status) {
    case 'unpaid':
      return '<span class="badge-primary" style="font-size: 10px; background-color: #f0ad4e; color: white; padding: 5px 10px; border-radius: 5px;">Unpaid</span>';
    case 'partialy_paid':
      return '<span class="badge-yellow" style="font-size: 10px; background-color: #5bc0de; color: white; padding: 5px 10px; border-radius: 5px;">Partialy Paid</span>';
    case 'paid':
      return '<span class="badge-success" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Paid</span>';
    default:
      return "<span>Tidak Ada Status</span>";
  }
}