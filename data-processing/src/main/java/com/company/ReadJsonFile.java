package com.company;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileReader;
import java.io.IOException;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;


public class ReadJsonFile {

    public static World worldData = new World();
    public static ArrayList<Country> nations = new ArrayList<>();

    public static void main(String[] args) {
        JSONParser jsonParser = new JSONParser();

        try (FileReader reader = new FileReader("vaccinations.json")) {
            Object obj = jsonParser.parse(reader);
            JSONArray vaccinationList = (JSONArray) obj;


            for (int i = 0; i < vaccinationList.size(); i++) {
                JSONObject country = (JSONObject) vaccinationList.get(i);
                JSONArray countrySpecificData = (JSONArray) country.get("data");

                if (country.get("iso_code").equals("OWID_WRL")) {
                    analyzeWorldSpecificData(countrySpecificData);
                }
            }


            for (int i = 0; i < vaccinationList.size(); i++) {
                JSONObject country = (JSONObject) vaccinationList.get(i);

                if (!country.get("iso_code").equals("OWID_WRL") && !country.get("iso_code").equals("OWID_EUN")) {

                    Country currentNation = new Country();
                    currentNation.setName((String) country.get("country"));
                    currentNation.setISO_Code((String) country.get("iso_code"));

                    JSONArray countrySpecificData = (JSONArray) country.get("data");
                    analyzeCountrySpecificData(currentNation, countrySpecificData);

                    System.out.println(currentNation.getName());
                    System.out.println(currentNation.getISO_Code());
                    System.out.println("People vaccinated: " + currentNation.getPeopleVaccinated());
                    System.out.println("Total vaccinations: " + currentNation.getTotalVaccinations());
                    System.out.println(currentNation.getTotalVaccinationsAsProportionOfWorld());
                    System.out.println(currentNation.getPeopleVaccinatedAsProportionOfWorld());
                    nations.add(currentNation);
                    System.out.println("***************");
                }

            }

            System.out.println("Number of countries = " + nations.size());
            WriteJSONFile.writeFile(nations, worldData);


        } catch (ParseException | IOException e) {
            e.printStackTrace();
        }
    }


    public static void analyzeCountrySpecificData(Country currentNation, JSONArray countrySpecificData) {


        for (int i = 0; i < countrySpecificData.size(); i++) {
            JSONObject dailyData = (JSONObject) countrySpecificData.get(i);
            int finalRecordForCountry = countrySpecificData.size() - 1; // March
            int middleRecordForCountry = countrySpecificData.size() / 2; // February
            int firstRecordForCountry = 0;

            if (i == middleRecordForCountry) {
                System.out.println(dailyData.get("date"));

                if (dailyData.containsKey("people_vaccinated")) {
                    currentNation.setPeopleVaccinated((Long) dailyData.get("people_vaccinated"));

                    int peopleVaccinatedInCurrentNation = Math.toIntExact(currentNation.getPeopleVaccinated());
                    int peopleVaccinatedWorldwide = Math.toIntExact(worldData.getPeopleVaccinated());

                    double peopleVaccinatedRatio = ((double) peopleVaccinatedInCurrentNation) / peopleVaccinatedWorldwide;
                    peopleVaccinatedRatio *= 100;
                    peopleVaccinatedRatio = roundDecimalFormat3dp(peopleVaccinatedRatio);

                    currentNation.setPeopleVaccinatedAsProportionOfWorld(peopleVaccinatedRatio);
                }

                if (dailyData.containsKey("total_vaccinations")) {
                    currentNation.setTotalVaccinations((Long) dailyData.get("total_vaccinations"));

                    int totalVaccinatedInCurrentNation = Math.toIntExact(currentNation.getTotalVaccinations());
                    int totalVaccinatedWorldwide = Math.toIntExact(worldData.getTotalVaccinations());

                    double totalVaccinationRatio = ((double) totalVaccinatedInCurrentNation / totalVaccinatedWorldwide);
                    totalVaccinationRatio *= 100;
                    totalVaccinationRatio = roundDecimalFormat3dp(totalVaccinationRatio);
//                    System.out.println("Total vaccination ratio: " + totalVaccinationRatio);

                    currentNation.setTotalVaccinationsAsProportionOfWorld(totalVaccinationRatio);
                }
            }
        }

    }

    public static void analyzeWorldSpecificData(JSONArray countrySpecificData) {

        for (int i = 0; i < countrySpecificData.size(); i++) {
            JSONObject dailyData = (JSONObject) countrySpecificData.get(i);
            int finalRecordForWorld = countrySpecificData.size() - 1;

            if (i == finalRecordForWorld) {
                worldData.setPeopleVaccinated((Long) dailyData.get("people_vaccinated"));
                worldData.setTotalVaccinations((Long) dailyData.get("total_vaccinations"));
            }
        }

    }

    public static double roundDecimalFormat3dp(double number) {
        DecimalFormat df = new DecimalFormat("#.###");
        df.setRoundingMode(RoundingMode.CEILING);
        return Double.parseDouble(df.format(number));
    }

}
