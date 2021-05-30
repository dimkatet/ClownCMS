using Authentication.Common;
using Authentication.Auth.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private JWTGenerator jwt;
        public AuthController(IOptions<AuthOptions> authOprions)
        {
            this.jwt = new JWTGenerator(authOprions);
        }


        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] Login request)
        {
            try
            {
                Account user = UserSupporting.AuthenticateUser(request.Email, request.Password);
                return Ok(new
                {
                    access_token = jwt.GenerateJWT(user),
                    name = user.Name
                });
            }
            catch(Exception e)
            {
                return BadRequest(new { massage = e.Message });
            }
        }

    }
}
