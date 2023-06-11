using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using System.IO;


namespace Assignment.Controllers
{
    public class DoctorsController : Controller
    {
        /* 
            GET: doctors
            Parameters: 
                isActive: [true, false] (filter)
                promotionLevel: [1, 2, ... 5] (filter)
        */
        [HttpGet]
        [Route("{isActive?}/{promotionLevel?}")]
        public ActionResult Index(string isActive = null, string promotionLevel = null)
        {
            IEnumerable<JToken> doctorsData = MvcApplication.DoctorsData;
            IEnumerable<JToken> articlesData = MvcApplication.ArticlesData;
            JToken languageData = MvcApplication.LanguageData;

            //filter by isActive property (true / false)
            if (!string.IsNullOrEmpty(isActive))
            {
                bool isActiveFilter = isActive.ToLower() == "true";
                doctorsData = doctorsData.Where(doctor => (bool)doctor["isActive"] == isActiveFilter);
            }

            //filter by promotionLevel property if cannot be parsed defaults to 5
            if (!string.IsNullOrEmpty(promotionLevel))
            {
                int promotionLevelFilter = int.TryParse(promotionLevel, out int parsedValue) ? parsedValue : 5;
                doctorsData = doctorsData.Where(doctor => (int)doctor["promotionLevel"] >= promotionLevelFilter);
            }

            //sort before returning
            //sort order: reviews.averageRatings desc => reviews.totalRatings desc => promotionLevel asc
            doctorsData = doctorsData.OrderByDescending(doctor => (int)doctor["reviews"]["averageRating"])
                .ThenByDescending(doctor => (int)doctor["reviews"]["totalRatings"])
                .ThenBy(doctor => (int)doctor["promotionLevel"]);

            //add has article (bool) and languageNames (array[str]) to each doctor object
            foreach (JObject doctor in doctorsData.OfType<JObject>())
            {
                //making sure both values are strings
                bool hasArticle = articlesData.Any(item => item["authorName"].ToString().Contains(doctor["fullName"].ToString()));
                doctor["hasArticle"] = hasArticle;
                //get language names by id and push to languageNames list, conver to JToken then add to doctor
                List<string> languageNames = new List<string>();
                foreach (string languageId in doctor["languageIds"]) {
                    string languageName = languageData["language"][languageId]?.ToString();
                    languageNames.Add(languageName);
                }
                JToken languageNamesToken = JArray.FromObject(languageNames);
                doctor["languageNames"] = languageNamesToken;
            }

            string doctorsDataJson = JsonConvert.SerializeObject(doctorsData);

            return Content(doctorsDataJson, "application/json");
        }

        /* 
        Post: doctors/contact
        */

        public class DoctorViewModel
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string DoctorId { get; set; }
        }
        [HttpPost]
        public ActionResult Contact(DoctorViewModel doctor)
        {
            //this assumes .json file exists and has an array format in place ([])
            //convert to JToken
            JToken contactObject = JToken.FromObject(doctor);
            //create path string
            string contactRequestsJsonPath = Path.Combine(HttpContext.Server.MapPath("~/Data/"), "contactRequests.json");
            //get current JSON contents and parse from string to JArray
            string existingJson = System.IO.File.ReadAllText(contactRequestsJsonPath);
            JArray jsonArray = JArray.Parse(existingJson);
            //add new contact object
            jsonArray.Add(contactObject);
            //parse JSON contents back to string and write to file
            string newJson = jsonArray.ToString();
            System.IO.File.WriteAllText(contactRequestsJsonPath, newJson);
            return Json(new { success = true });
        }
    }
}