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
        private IOptions<AuthOptions> authOptions;
        public AuthController(IOptions<AuthOptions> authOprions)
        {
            this.authOptions = authOprions;
        }


        [Route("registration")]
        [HttpPost]
        public IActionResult Registration([FromBody] Registration request)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    Account user = new Account() { Email = request.Email, Password = request.Password, Name = request.Name };
                    db.Accounts.Add(user);
                    db.SaveChanges();
                    return Ok(new
                    {
                        access_token = GenerateJWT(user),
                        name = user.Name
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { massage = e.Message });
            }
        }


        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] Login request)
        {
            try
            {
                Account user = AuthenticateUser(request.Email, request.Password);
                return Ok(new
                {
                    access_token = GenerateJWT(user),
                    name = user.Name
                });
            }
            catch(Exception e)
            {
                return BadRequest(new { massage = e.Message });
            }
        }
        private Account AuthenticateUser(string Email, string Password) 
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                try
                {
                    return db.Accounts.Where(acc => acc.Email == Email && acc.Password == Password).First();
                }
                catch(Exception e)
                {
                    throw e;
                }
            }
        }

        private string GenerateJWT(Account user)
        {
            var authParams = authOptions.Value;

            var securKay = authParams.GetSymmetricSecurityKey();
            var credentials = new SigningCredentials(securKay, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.AccountId.ToString())
            };

            var token = new JwtSecurityToken(authParams.Issuer,
                authParams.Audience,
                claims,
                expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

//new Claim(ClaimTypes.Name, user.Name)
