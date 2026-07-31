package com.company;

public class World {
    private Long peopleVaccinated;
    private Long totalVaccinations;

    public Long getPeopleVaccinated() {
        return peopleVaccinated;
    }

    public void setPeopleVaccinated(Long peopleVaccinated) {
        System.out.println(peopleVaccinated);
        this.peopleVaccinated = peopleVaccinated;
    }

    public Long getTotalVaccinations() {
        return totalVaccinations;
    }

    public void setTotalVaccinations(Long totalVaccinations) {
        this.totalVaccinations = totalVaccinations;
    }
}
