using Microsoft.AspNetCore.Mvc;
using MobiPark.App.Presenters;
using MobiPark.Domain.Exceptions;
using MobiPark.Domain.Interfaces;
using MobiPark.Domain.Models;

namespace MobiPark.App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly IReservationRepository _reservationRepository;

    public ReservationController(IReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    [HttpGet]
    public IActionResult GetReservations()
    {
        var user = (User)HttpContext.Items["User"]!;
        var reservations = _reservationRepository.GetReservationsByOwner(user.Id);
        var reservationPresenters = reservations.ConvertAll(r => new ReservationPresenter(r));
        return Ok(reservationPresenters);
    }

    [HttpGet("{plate}")]
    public IActionResult GetReservation(string plate)
    {
        var user = (User)HttpContext.Items["User"]!;
        var reservation = _reservationRepository.FindByPlate(plate);
        if (reservation.Vehicle.OwnerId != user.Id) throw new NotFoundException("Reservation not found.");
        return Ok(new ReservationPresenter(reservation));
    }
}
