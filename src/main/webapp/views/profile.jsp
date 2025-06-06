<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>User Profile - RelaXit</title>
    <!-- Bootstrap CSS -->
    <link href="<c:url value='/assets/css/bootstrap.min.css'/>" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <!-- Material Design Icons -->
    <link href="<c:url value='/assets/css/material-design-iconic-font.css'/>" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/material-design-iconic-font@2.2.0/dist/css/material-design-iconic-font.min.css">
    <!-- Custom CSS -->
    <link href="<c:url value='/assets/css/first.css'/>" rel="stylesheet">
    <link href="<c:url value='/assets/css/style.css'/>" rel="stylesheet">
    <!-- Profile-specific CSS -->
    <link href="<c:url value='/assets/css/profile.css'/>" rel="stylesheet">
</head>
<body>
    <!-- Include Header -->
    <jsp:include page="header.jsp">
        <jsp:param name="activePage" value="profile" />
    </jsp:include>

    <!-- Profile Content -->
    <div class="container">
        <div class="luxe-side left-side">
            <div class="chair" style="background-image: url('https://pngimg.com/uploads/armchair/armchair_PNG7066.png');"></div>
            <div class="pillow" style="background-image: url('https://pngimg.com/uploads/pillow/pillow_PNG14203.png');"></div>
            <div class="table" style="background-image: url('https://pngimg.com/uploads/table/table_PNG6937.png');"></div>
            <div class="lamp" style="background-image: url('https://pngimg.com/uploads/lamp/lamp_PNG101484.png');"></div>
            <div class="clock" style="background-image: url('https://pngimg.com/uploads/clock/clock_PNG8.png');"></div>
        </div>
        <div class="luxe-side right-side">
            <div class="chair" style="background-image: url('https://pngimg.com/uploads/armchair/armchair_PNG7066.png');"></div>
            <div class="pillow" style="background-image: url('https://pngimg.com/uploads/pillow/pillow_PNG14203.png');"></div>
            <div class="table" style="background-image: url('https://pngimg.com/uploads/table/table_PNG6937.png');"></div>
            <div class="lamp" style="background-image: url('https://pngimg.com/uploads/lamp/lamp_PNG101484.png');"></div>
            <div class="clock" style="background-image: url('https://pngimg.com/uploads/clock/clock_PNG8.png');"></div>
        </div>

        <div class="profile-wrapper">
            <div class="profile-container">
                <!-- Profile View -->
                <div id="profileView" class="profile-section active">
                    <div class="profile-avatar">
                        <img src="${user.profileImage != null && !user.profileImage.isEmpty() ? (user.profileImage.startsWith('http') ? user.profileImage : pageContext.request.contextPath.concat('/images/').concat(user.profileImage)) : pageContext.request.contextPath.concat('/images/uploads/0e5d4160-83af-4e54-8fe2-6d091d580215.jpg')}"
                             alt="Profile Image"
                             onerror="this.src='${pageContext.request.contextPath}/images/uploads/0e5d4160-83af-4e54-8fe2-6d091d580215.jpg'; console.log('Image failed to load: ${user.profileImage}');">
                    </div>
                    <div class="profile-details">
                        <h2>${user.fullName}</h2>
                        <p><i class="fas fa-envelope"></i> ${user.email}</p>
                        <p><i class="fas fa-briefcase"></i> ${user.job}</p>
                        <p><i class="fas fa-home"></i> ${user.address}</p>
                        <p><i class="fas fa-heart"></i> ${user.interests != null ? user.interests : 'Not specified'}</p>
                        <p><i class="fas fa-birthday-cake"></i> ${user.birthdate}</p>
                        <p><i class="fas fa-user-plus"></i> Joined: ${user.createdAt.toLocalDate()}</p>
                        <p><i class="fas fa-sync-alt"></i> Updated: ${user.updatedAt.toLocalDate()}</p>
                        <p><i class="fas fa-credit-card"></i> Credit Limit: ${user.creditLimit != null ? user.creditLimit : 'Not set'}</p>
                    </div>
                    <button id="editProfileBtn" class="luxury-btn"><i class="fas fa-edit"></i> Edit Profile</button>
                </div>

                <!-- Profile Edit Form -->
                <form id="profileEditForm" class="profile-section" action="${pageContext.request.contextPath}/profile" method="POST" enctype="multipart/form-data">
                    <div class="form-content">
                        <!-- Avatar Upload Section -->
                        <div class="avatar-upload-group">
                            <input type="file" id="editProfileImage" name="editProfileImage" accept="image/*" class="hidden-file-input">
                            <label for="editProfileImage" class="avatar-upload-label">
                                <div class="avatar-preview">
                                    <img src="${user.profileImage != null && !user.profileImage.isEmpty() ? (user.profileImage.startsWith('http') ? user.profileImage : pageContext.request.contextPath.concat('/images/').concat(user.profileImage)) : pageContext.request.contextPath.concat('/images/uploads/0e5d4160-83af-4e54-8fe2-6d091d580215.jpg')}"
                                         alt="Profile Preview"
                                         data-default-src="${pageContext.request.contextPath}/images/uploads/0e5d4160-83af-4e54-8fe2-6d091d580215.jpg"
                                         onerror="this.src='${pageContext.request.contextPath}/images/uploads/0e5d4160-83af-4e54-8fe2-6d091d580215.jpg'; console.log('Image failed to load: ${user.profileImage}');">
                                    <div class="default-avatar"><i class="fas fa-user"></i></div>
                                    <div class="avatar-overlay"><i class="fas fa-camera"></i> Change Photo</div>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Input Fields -->
                        <div class="form-group">
                            <input type="text" id="editFullName" name="editFullName" value="${user.fullName}" required>
                            <label for="editFullName">Full Name</label>
                            <i class="fas fa-user input-icon"></i>
                        </div>
                        <div class="form-group">
                            <input type="email" id="editEmail" name="editEmail" value="${user.email}" required readonly>
                            <label for="editEmail">Email Address</label>
                            <i class="fas fa-envelope input-icon"></i>
                        </div>
                        <div class="form-group">
                            <input type="text" id="editJob" name="editJob" value="${user.job}" required>
                            <label for="editJob">Profession</label>
                            <i class="fas fa-briefcase input-icon"></i>
                        </div>
                        <div class="form-group">
                            <input type="text" id="editAddress" name="editAddress" value="${user.address}" required>
                            <label for="editAddress">Residence</label>
                            <i class="fas fa-home input-icon"></i>
                        </div>
                        <div class="form-group">
                            <input type="text" id="editInterests" name="editInterests" value="${user.interests}">
                            <label for="editInterests">Interests</label>
                            <i class="fas fa-heart input-icon"></i>
                        </div>
                        <div class="form-group">
                            <input type="date" id="editBirthdate" name="editBirthdate" value="${user.birthdate}" required>
                            <label for="editBirthdate">Date of Birth</label>
                        </div>
                        <div class="form-group">
                            <input type="number" id="editCreditLimit" name="editCreditLimit" value="${user.creditLimit}" step="0.01" required>
                            <label for="editCreditLimit">Credit Limit</label>
                            <i class="fas fa-credit-card input-icon"></i>
                            <span id="creditLimitValidationResult" class="credit-limit-result"></span>
                        </div>
                        
                        <!-- Change Password Button -->
                        <div class="form-group">
                            <button type="button" id="changePasswordBtn" class="luxury-btn secondary">
                                <i class="fas fa-lock"></i> Change Password
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" id="saveProfileBtn" class="luxury-btn"><i class="fas fa-save"></i> Save Changes</button>
                        <button type="button" id="cancelEditBtn" class="luxury-btn secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Password Change Modal -->
        <div class="modal">
            <div class="modal-content">
                <span class="close"><i class="fas fa-times"></i></span>
                <h2>Change Password</h2>
                <div class="form-group">
                    <input type="password" id="currentPassword" name="currentPassword" required>
                    <label for="currentPassword">Current Password</label>
                    <span id="passwordCheckResult" class="password-check-result"></span>
                </div>
                <div class="form-group">
                    <input type="password" id="newPassword" name="newPassword" required>
                    <label for="newPassword">New Password</label>
                </div>
                <div class="form-group">
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required>
                    <label for="confirmNewPassword">Confirm New Password</label>
                    <span id="passwordMatchResult" class="password-check-result"></span>
                </div>
                <button id="savePasswordBtn" class="luxury-btn"><i class="fas fa-key"></i> Save Password</button>
            </div>
        </div>

        <div id="successPopup" class="success-popup">
            <p>Password changed successfully!<br>Please use your new password for future logins.</p>
        </div>

        <canvas id="confettiCanvas" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none;"></canvas>
        <div id="celebration">
            <div class="confetti"></div>
        </div>
    </div>

    <!-- Include Footer -->
    <jsp:include page="footer.jsp" />

    <!-- JavaScript -->
    <script>
        window.contextPath = "${pageContext.request.contextPath}";
    </script>
    <script src="<c:url value='/assets/js/jquery-3.6.0.min.js'/>"></script>
    <script src="<c:url value='/assets/js/bootstrap.bundle.min.js'/>"></script>
    <script src="<c:url value='/assets/js/cart.js'/>"></script>
    <script src="<c:url value='/assets/js/profile.js'/>"></script>
</body>
</html>