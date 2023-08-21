const HomeController = {
  getHome: (req, res) => {
    res.json({
      Message: 'Welcome to Home!',
      Host: 'http://localhost:3000',
      Data: [
        {
          Endpoint: '/pageUser',
        },
        { Endpoint: '/pageAdmin' },
      ],
    });
  },

  pageUser: (req, res) => {
    res.json({
      Message: 'Welcome to page User!',
      Host: 'http://localhost:3000',
      Data: [
        {
          Endpoint: '/auth/register',
          Method: 'post',
          Request: {
            Body: 'username, email, password ',
            Authorization: 'token',
          },
          Description: 'Register user',
        },
        {
          Endpoint: '/auth/login',
          Method: 'post',
          Request: {
            Body: 'username, password',
            isVerify: 'true',
          },
          Description: 'Login user',
        },
        {
          Endpoint: '/auth/changepassword/:name',
          Method: 'put',
          Request: {
            Body: 'username, oldPassword, newPassword',
          },
          Description: 'Change password',
        },
        {
          Endpoint: '/auth/profile/:username',
          Method: 'get',
          Description: 'Profile user',
        },
        {
          Endpoint: '/teams',
          Method: 'get',
          Description: 'User see all teams',
        },
        {
          Endpoint: '/teams/:id',
          Method: 'get',
          Request: {
            Params: 'id',
          },
          Description: 'User see teams by ID',
        },
      ],
    });
  },
  pageAdmin: (req, res) => {
    res.json({
      Message: 'Welcome to page Admin!',
      Host: 'http://localhost:3000',
      Data: [
        {
          Endpoint: '/auth/register',
          Method: 'post',
          Request: {
            Body: 'username, email, password',
          },
          Description: 'Create user',
        },
        {
          Endpoint: '/auth/register',
          Method: 'get',
          Request: {
            Authorization: 'token',
            isAdmin: 'true',
          },
          Description: 'Admin see all users',
        },
        {
          Endpoint: '/auth/register/:id',
          Method: 'delete',
          Request: {
            params: 'id',
            Authorization: 'token',
            isAdmin: 'true',
          },
          Description: 'Admin delete user by ID',
        },
        {
          Endpoint: '/auth/login',
          Method: 'post',
          Request: {
            Body: 'username, password',
          },
          Description: 'Admin login',
        },
        {
          Endpoint: '/auth/changepassword/:name',
          Method: 'put',
          Request: {
            Body: 'username, oldPassword, newPassword',
            Authorization: 'token',
          },
          Description: 'Admin change password',
        },
        {
          Endpoint: '/auth/profile/:username',
          Method: 'get',
          Request: {
            Authorization: 'token',
          },
          Description: 'Admin see profile',
        },
        {
          Endpoint: '/teams',
          Method: 'post',
          Request: {
            Body: 'name, city, year, stadium, photo',
            Authorization: 'token',
          },
          Description: 'Admin add new team',
        },
        {
          Endpoint: '/teams',
          Method: 'get',
          Description: 'Admin see all teams',
        },
        {
          Endpoint: '/teams/:id',
          Method: 'get',
          Request: {
            Params: 'id',
          },
          Description: 'Admin see team by ID',
        },
        {
          Endpoint: '/teams/:id',
          Method: 'put',
          Request: {
            Body: 'name, city, year, stadium, photo',
            Params: 'id',
            Authorization: 'token',
          },
          Description: 'Admin see team by ID',
        },
        {
          Endpoint: '/teams/:id',
          Method: 'delete',
          Request: {
            Params: 'id',
            Authorization: 'token',
          },
          Description: 'Admin delete team by ID',
        },
      ],
    });
  },
};

export default HomeController;
