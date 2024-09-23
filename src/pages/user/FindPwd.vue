<template lang="">
    FindPwd
    </template>
    <script>
     
     const testUserApi = async () => {
        try {
        // 1. 일반 회원가입 테스트
        const newUser = {
            name: "이름",
            nickname: "닉네임",
            id: "아이디",
            password: "비번",
            email: "이메일",
            gender: true,
            birth: "1997-02-05",
        };
        const createdUser = await UserApi.signup(newUser);
        console.log("회원가입 성공:", createdUser);
    
        // 2. ID 중복체크 테스트
        const idDupCheck = await UserApi.idDuplicateCheck("checkId");
        console.log("아이디 중복 체크 성공:", idDupCheck);
    
        // 3-1. 소셜 회원가입 정보전달 테스트
        const socialSignupInfo = await UserApi.socialSignupInfo();
        console.log("소셜 회원가입 정보전달 체크 성공:", socialSignupInfo);

        // 3. 소셜 회원가입 등록 테스트
        const socialUser = {
            name: "소셜이름",
            nickname: "소셜닉네임",
            email: "소셜이메일",
            gender: true,
            birth: "1997-02-05",
        };
        const socialCreatedUser = await UserApi.socialSignupRegister(socialUser);
        console.log("소셜 회원가입 성공:", socialCreatedUser);
    
        // 4. 일반 로그인 테스트
        const loginUser = {
            id: "아이디",
            password: "비번",
        };
        const loggedInUser = await UserApi.login(loginUser);
        console.log("로그인 성공:", loggedInUser);
    
        // 5. 소셜 로그인 테스트
        const socialLoginUser = {
            id: "소셜아이디",
            password: "소셜비번",
        };
        const socialLoggedInUser = await UserApi.socialLogin(socialLoginUser);
        console.log("소셜 로그인 성공:", socialLoggedInUser);
    
        // 6. 로그아웃 테스트
        const logoutResult = await UserApi.logout();
        console.log("로그아웃 성공:", logoutResult);
    
        // 7. 아이디 찾기 테스트
        const findUserId = {
            name: "이름",
            email: "이메일",
        };
        const foundUserId = await UserApi.findUserId(findUserId);
        console.log("아이디 찾기 성공:", foundUserId);
    
        // 8. 비밀번호 찾기 테스트
        const userForPwdReset = {
            name: "이름",
            id: "아이디",
            email: "이메일",
        };
        const foundUserPwd = await UserApi.findUserPwd(userForPwdReset);
        console.log("비밀번호 찾기 성공:", foundUserPwd);
    
        } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        }
    };
    </script>
    <style lang=""></style>